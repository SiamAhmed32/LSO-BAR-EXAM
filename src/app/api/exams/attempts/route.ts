import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/server/session";

// GET /api/exams/attempts - Get current user's exam attempts
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Please login to view your exam attempts",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    const examId = searchParams.get("examId"); // Optional filter by exam

    // Build where clause
    const where: any = {
      userId: session.id,
    };
    if (examId) {
      where.examId = examId;
    }

    // Get user's exam attempts
    const [attempts, total] = await Promise.all([
      prisma.examAttempt.findMany({
        where,
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
        orderBy: {
          submittedAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.examAttempt.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        success: true,
        message: "Exam attempts retrieved successfully",
        data: {
          attempts,
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
  } catch (error: any) {
    console.error("Get Exam Attempts Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error?.message || "Failed to retrieve exam attempts",
      },
      { status: 500 }
    );
  }
}

