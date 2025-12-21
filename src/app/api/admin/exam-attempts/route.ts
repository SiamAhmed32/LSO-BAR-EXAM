import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/server/session";

// GET /api/admin/exam-attempts - Get all exam attempts (admin only)
export async function GET(request: NextRequest): Promise<NextResponse> {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;
    const examId = searchParams.get("examId"); // Optional filter by exam
    const userId = searchParams.get("userId"); // Optional filter by user
    const search = searchParams.get("search"); // Search by user email or name

    // Build where clause
    const where: any = {};
    if (examId) {
      where.examId = examId;
    }
    if (userId) {
      where.userId = userId;
    }
    if (search) {
      where.user = {
        OR: [
          { email: { contains: search, mode: "insensitive" } },
          { name: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    // Get all exam attempts
    const [attempts, total] = await Promise.all([
      prisma.examAttempt.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
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

    // Calculate summary stats
    const stats = await prisma.examAttempt.aggregate({
      _avg: {
        score: true,
      },
      _count: {
        id: true,
      },
    });

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
          stats: {
            totalAttempts: stats._count.id,
            averageScore: stats._avg.score || 0,
          },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Admin Get Exam Attempts Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error?.message || "Failed to retrieve exam attempts",
      },
      { status: 500 }
    );
  }
}

