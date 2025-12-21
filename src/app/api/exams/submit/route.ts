import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/server/session";
import { submitExamSchema } from "@/validation/exam.validation";

// POST /api/exams/submit - Submit exam results
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Please login to submit exam",
        },
        { status: 401 }
      );
    }

    // Validate schema is available
    if (!submitExamSchema) {
      console.error("submitExamSchema is not defined");
      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: "Schema validation not available",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const result = submitExamSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid data",
          details: result.error.issues,
          message: "Please check your input and try again",
        },
        { status: 400 }
      );
    }

    const {
      examId,
      totalQuestions,
      answeredCount,
      correctCount,
      incorrectCount,
      unansweredCount,
      score,
      answers,
    } = result.data;

    // Verify exam exists
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      select: {
        id: true,
        attemptCount: true,
        pricingType: true,
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

    // For paid exams, find the most recent purchase and check remaining attempts
    let mostRecentOrderItem = null;
    if (exam.pricingType === "PAID" && exam.attemptCount !== null && exam.attemptCount > 0) {
      // Find the most recent order item for this exam
      mostRecentOrderItem = await prisma.orderItem.findFirst({
        where: {
          examId: examId,
          order: {
            userId: session.id,
            status: "COMPLETED",
            payment: {
              status: "SUCCEEDED",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!mostRecentOrderItem) {
        return NextResponse.json(
          {
            error: "Forbidden",
            message: "You have not purchased this exam",
          },
          { status: 403 }
        );
      }

      // Count attempts only from the most recent purchase
      const existingAttempts = await prisma.examAttempt.count({
        where: {
          userId: session.id,
          examId: examId,
          orderItemId: mostRecentOrderItem.id,
        },
      });

      // Check if user has remaining attempts
      if (existingAttempts >= exam.attemptCount) {
        return NextResponse.json(
          {
            error: "Forbidden",
            message: "You have exhausted all attempts for this exam",
          },
          { status: 403 }
        );
      }
    }

    // Create exam attempt record
    const examAttempt = await prisma.examAttempt.create({
      data: {
        userId: session.id,
        examId: examId,
        orderItemId: mostRecentOrderItem?.id || null,
        totalQuestions,
        answeredCount,
        correctCount,
        incorrectCount,
        unansweredCount,
        score,
        answers: answers as any, // Store as JSON
      },
    });

    // Calculate remaining attempts for response
    let remainingAttempts: number | null = null;
    if (exam.pricingType === "PAID" && exam.attemptCount !== null && exam.attemptCount > 0 && mostRecentOrderItem) {
      const totalAttempts = await prisma.examAttempt.count({
        where: {
          userId: session.id,
          examId: examId,
          orderItemId: mostRecentOrderItem.id,
        },
      });
      remainingAttempts = Math.max(0, exam.attemptCount - totalAttempts);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Exam submitted successfully",
        data: {
          attemptId: examAttempt.id,
          remainingAttempts: remainingAttempts,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Submit Exam Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error?.message || "Failed to submit exam",
        details: process.env.NODE_ENV !== "production" ? error : undefined,
      },
      { status: 500 }
    );
  }
}

