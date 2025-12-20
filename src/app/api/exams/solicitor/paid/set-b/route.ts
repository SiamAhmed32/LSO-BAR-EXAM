import prisma from "@/lib/prisma";
import { getSession } from "@/lib/server/session";
import { ratelimit } from "@/lib/server/ratelimit";
import { createQuestionSchema, createExamSchema } from "@/validation/exam.validation";
import { NextRequest, NextResponse } from "next/server";

const EXAM_TYPE = "SOLICITOR";
const PRICING_TYPE = "PAID";
const EXAM_SET = "SET_B";

// GET all questions for solicitor paid exam (requires login)
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Please login to access paid exam questions",
        },
        { status: 401 }
      );
    }

    const { success } = await ratelimit.limit(session.id);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests", message: "Please try again later." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Get or create exam
    let exam = await prisma.exam.findUnique({
      where: {
        examType_pricingType_examSet: {
          examType: EXAM_TYPE,
          pricingType: PRICING_TYPE,
          examSet: EXAM_SET,
        },
      },
    });

    if (!exam) {
      exam = await prisma.exam.create({
        data: {
          examType: EXAM_TYPE,
          pricingType: PRICING_TYPE,
          examSet: EXAM_SET,
        },
      });
    }

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where: { examId: exam.id },
        include: {
          options: {
            orderBy: { createdAt: "asc" },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "asc",
        },
      }),
      prisma.question.count({
        where: { examId: exam.id },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        success: true,
        message: "Questions retrieved successfully",
        data: {
          exam: {
            id: exam.id,
            examType: exam.examType,
            pricingType: exam.pricingType,
            title: exam.title,
            description: exam.description,
            price: exam.price,
            examTime: exam.examTime,
            questionCount: total,
            attemptCount: exam.attemptCount,
          },
          questions,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Solicitor Paid Exam GET Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to retrieve questions",
      },
      { status: 500 }
    );
  }
}

// POST create a new question for solicitor paid exam
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "You are not authorized to access this resource",
        },
        { status: 401 }
      );
    }

    const { success } = await ratelimit.limit(session.id);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests", message: "Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = createQuestionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid data",
          details: result.error,
          message: "Please check your input and try again",
        },
        { status: 400 }
      );
    }

    // Get or create exam
    let exam = await prisma.exam.findUnique({
      where: {
        examType_pricingType_examSet: {
          examType: EXAM_TYPE,
          pricingType: PRICING_TYPE,
          examSet: EXAM_SET,
        },
      },
    });

    if (!exam) {
      exam = await prisma.exam.create({
        data: {
          examType: EXAM_TYPE,
          pricingType: PRICING_TYPE,
          examSet: EXAM_SET,
        },
      });
    }

    const { question, options } = result.data;

    const createdQuestion = await prisma.question.create({
      data: {
        examId: exam.id,
        question,
        options: {
          create: options.map((opt) => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
          })),
        },
      },
      include: {
        options: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Question created successfully",
        data: createdQuestion,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Solicitor Paid Exam POST Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to create question",
      },
      { status: 500 }
    );
  }
}

// PUT update exam details
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "You are not authorized to access this resource",
        },
        { status: 401 }
      );
    }

    const { success } = await ratelimit.limit(session.id);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests", message: "Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = createExamSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid data",
          details: result.error,
          message: "Please check your input and try again",
        },
        { status: 400 }
      );
    }

    // Get or create exam
    let exam = await prisma.exam.findUnique({
      where: {
        examType_pricingType_examSet: {
          examType: EXAM_TYPE,
          pricingType: PRICING_TYPE,
          examSet: EXAM_SET,
        },
      },
    });

    if (!exam) {
      exam = await prisma.exam.create({
        data: {
          examType: EXAM_TYPE,
          pricingType: PRICING_TYPE,
          examSet: EXAM_SET,
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          examTime: result.data.examTime || null,
          attemptCount: result.data.attemptCount || null,
        },
      });
    } else {
      const updateData: any = {};
      
      if (result.data.title !== undefined) {
        updateData.title = result.data.title || null;
      }
      if (result.data.description !== undefined) {
        updateData.description = result.data.description || null;
      }
      if (result.data.price !== undefined) {
        updateData.price = result.data.price ?? null;
      }
      if (result.data.examTime !== undefined) {
        updateData.examTime = result.data.examTime || null;
      }
      if (result.data.attemptCount !== undefined) {
        // Handle 0 as a valid value, only set null if explicitly null/undefined
        updateData.attemptCount = result.data.attemptCount === null || result.data.attemptCount === undefined
          ? null
          : Number(result.data.attemptCount);
      }

      if (Object.keys(updateData).length === 0) {
        return NextResponse.json(
          {
            error: "Bad Request",
            message: "No fields provided for update",
          },
          { status: 400 }
        );
      }

      exam = await prisma.exam.update({
        where: { id: exam.id },
        data: updateData,
      });
    }

    // Compute questionCount dynamically
    const questionCount = await prisma.question.count({
      where: { examId: exam.id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Exam updated successfully",
        data: {
          ...exam,
          questionCount,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Solicitor Paid Exam PUT Error:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
    });
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error?.message || "Failed to update exam",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}

