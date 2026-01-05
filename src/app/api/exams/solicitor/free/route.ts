import prisma from "@/lib/prisma";
import { getSession } from "@/lib/server/session";
import { ratelimit } from "@/lib/server/ratelimit";
import { createQuestionSchema, createExamSchema } from "@/validation/exam.validation";
import { NextRequest, NextResponse } from "next/server";

const EXAM_TYPE = "SOLICITOR";
const PRICING_TYPE = "FREE";

// GET all questions for solicitor free exam (public access)
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Rate limiting using IP address for guest users
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";
    const { success } = await ratelimit.limit(ip);
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

    // Get or create exam (for free exams, examSet is null)
    let exam = await prisma.exam.findFirst({
      where: {
        examType: EXAM_TYPE,
        pricingType: PRICING_TYPE,
        examSet: null,
      },
    });

    if (!exam) {
      exam = await prisma.exam.create({
        data: {
          examType: EXAM_TYPE,
          pricingType: PRICING_TYPE,
          examSet: null,
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
    console.error("Solicitor Free Exam GET Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to retrieve questions",
      },
      { status: 500 }
    );
  }
}

// POST create a new question for solicitor free exam
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

    // Get or create exam (for free exams, examSet is null)
    let exam = await prisma.exam.findFirst({
      where: {
        examType: EXAM_TYPE,
        pricingType: PRICING_TYPE,
        examSet: null,
      },
    });

    if (!exam) {
      exam = await prisma.exam.create({
        data: {
          examType: EXAM_TYPE,
          pricingType: PRICING_TYPE,
          examSet: null,
        },
      });
    }

    const { question, explanation, options } = result.data;

    const createdQuestion = await prisma.question.create({
      data: {
        examId: exam.id,
        question,
        explanation: explanation || null,
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
    console.error("Solicitor Free Exam POST Error:", error);
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

    // Get or create exam (for free exams, examSet is null)
    let exam = await prisma.exam.findFirst({
      where: {
        examType: EXAM_TYPE,
        pricingType: PRICING_TYPE,
        examSet: null,
      },
    });

    if (!exam) {
      exam = await prisma.exam.create({
        data: {
          examType: EXAM_TYPE,
          pricingType: PRICING_TYPE,
          examSet: null,
          title: result.data.title,
          description: result.data.description,
        },
      });
    } else {
      exam = await prisma.exam.update({
        where: { id: exam.id },
        data: {
          title: result.data.title,
          description: result.data.description,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Exam updated successfully",
        data: exam,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Solicitor Free Exam PUT Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to update exam",
      },
      { status: 500 }
    );
  }
}

