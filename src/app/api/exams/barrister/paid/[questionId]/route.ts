import prisma from "@/lib/prisma";
import { getSession } from "@/lib/server/session";
import { ratelimit } from "@/lib/server/ratelimit";
import { createQuestionSchema } from "@/validation/exam.validation";
import { NextRequest, NextResponse } from "next/server";

const EXAM_TYPE = "BARRISTER";
const PRICING_TYPE = "PAID";

// GET single question by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
): Promise<NextResponse> {
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

    const { questionId } = await params;

    // Verify exam exists
    const exam = await prisma.exam.findUnique({
      where: {
        examType_pricingType: {
          examType: EXAM_TYPE,
          pricingType: PRICING_TYPE,
        },
      },
    });

    if (!exam) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "Exam not found",
        },
        { status: 404 }
      );
    }

    const question = await prisma.question.findFirst({
      where: {
        id: questionId,
        examId: exam.id,
      },
      include: {
        options: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!question) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "Question not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Question retrieved successfully",
        data: question,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Barrister Paid Exam Question GET Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to retrieve question",
      },
      { status: 500 }
    );
  }
}

// PUT update question
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
): Promise<NextResponse> {
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

    const { questionId } = await params;
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

    // Verify exam exists
    const exam = await prisma.exam.findUnique({
      where: {
        examType_pricingType: {
          examType: EXAM_TYPE,
          pricingType: PRICING_TYPE,
        },
      },
    });

    if (!exam) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "Exam not found",
        },
        { status: 404 }
      );
    }

    // Verify question exists
    const existingQuestion = await prisma.question.findFirst({
      where: {
        id: questionId,
        examId: exam.id,
      },
    });

    if (!existingQuestion) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "Question not found",
        },
        { status: 404 }
      );
    }

    const { question, options } = result.data;

    // Update question and options
    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: {
        question,
        options: {
          deleteMany: {},
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
        message: "Question updated successfully",
        data: updatedQuestion,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Barrister Paid Exam Question PUT Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to update question",
      },
      { status: 500 }
    );
  }
}

// DELETE question
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
): Promise<NextResponse> {
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

    const { questionId } = await params;

    // Verify exam exists
    const exam = await prisma.exam.findUnique({
      where: {
        examType_pricingType: {
          examType: EXAM_TYPE,
          pricingType: PRICING_TYPE,
        },
      },
    });

    if (!exam) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "Exam not found",
        },
        { status: 404 }
      );
    }

    // Verify question exists
    const existingQuestion = await prisma.question.findFirst({
      where: {
        id: questionId,
        examId: exam.id,
      },
    });

    if (!existingQuestion) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "Question not found",
        },
        { status: 404 }
      );
    }

    await prisma.question.delete({
      where: { id: questionId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Question deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Barrister Paid Exam Question DELETE Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to delete question",
      },
      { status: 500 }
    );
  }
}

