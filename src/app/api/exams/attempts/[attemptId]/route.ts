import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/server/session";

// GET /api/exams/attempts/[attemptId] - Get detailed exam attempt with questions and answers
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Please login to view exam attempt details",
        },
        { status: 401 }
      );
    }

    const { attemptId } = await params;

    // Get exam attempt with exam details
    const attempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        exam: {
          select: {
            id: true,
            examType: true,
            examSet: true,
            title: true,
            pricingType: true,
          },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "Exam attempt not found",
        },
        { status: 404 }
      );
    }

    // Verify the attempt belongs to the user (unless admin)
    if (attempt.userId !== session.id && session.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: "You don't have permission to view this exam attempt",
        },
        { status: 403 }
      );
    }

    // Fetch all questions for this exam with their options
    const questions = await prisma.question.findMany({
      where: { examId: attempt.examId },
      include: {
        options: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // Map questions to include user's answer and correct answer
    const questionsWithAnswers = questions.map((question, index) => {
      const questionNumber = index + 1;
      const userAnswerId = (attempt.answers as Record<string, string>)[String(questionNumber)];
      const correctOption = question.options.find((opt) => opt.isCorrect);
      const userSelectedOption = question.options.find((opt) => opt.id === userAnswerId);

      // Type assertion to allow optional category field (for future schema updates)
      // When category is added to Prisma schema, this will automatically work
      const questionWithCategory = question as typeof question & { category?: string };

      return {
        id: question.id,
        questionNumber: questionNumber,
        question: question.question,
        category: questionWithCategory.category || "General", // Use category if available, fallback to "General"
        options: question.options.map((option) => ({
          id: option.id,
          text: option.text,
          isCorrect: option.isCorrect,
          isUserSelected: option.id === userAnswerId,
        })),
        userAnswerId: userAnswerId || null,
        correctAnswerId: correctOption?.id || null,
        isCorrect: userAnswerId === correctOption?.id,
      };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Exam attempt details retrieved successfully",
        data: {
          attempt: {
            id: attempt.id,
            userId: attempt.userId,
            examId: attempt.examId,
            totalQuestions: attempt.totalQuestions,
            answeredCount: attempt.answeredCount,
            correctCount: attempt.correctCount,
            incorrectCount: attempt.incorrectCount,
            unansweredCount: attempt.unansweredCount,
            score: attempt.score,
            submittedAt: attempt.submittedAt,
            exam: attempt.exam,
          },
          questions: questionsWithAnswers,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get Exam Attempt Details Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error?.message || "Failed to retrieve exam attempt details",
      },
      { status: 500 }
    );
  }
}

