import prisma from "@/lib/prisma";
import { getSession } from "@/lib/server/session";
import { ratelimit } from "@/lib/server/ratelimit";
import { NextRequest, NextResponse } from "next/server";

// GET dashboard statistics (admin only)
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

    const { success } = await ratelimit.limit(session.id);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests", message: "Please try again later." },
        { status: 429 }
      );
    }

    // Fetch all statistics in parallel
    const [
      totalUsers,
      totalOrders,
      totalQuestions,
      barristerFreeQuestions,
      barristerPaidQuestions,
      solicitorFreeQuestions,
      solicitorPaidQuestions,
      recentUsers,
      recentQuestions,
    ] = await Promise.all([
      // Total users count
      prisma.user.count(),

      // Total orders count (if orders table exists, otherwise 0)
      prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*)::int as count FROM orders
      `.then((result) => Number(result[0]?.count || 0)).catch(() => 0),

      // Total questions across all exams
      prisma.question.count(),

      // Questions by exam type
      prisma.exam
        .findUnique({
          where: {
            examType_pricingType: {
              examType: "BARRISTER",
              pricingType: "FREE",
            },
          },
        })
        .then((exam) =>
          exam
            ? prisma.question.count({ where: { examId: exam.id } })
            : 0
        ),

      prisma.exam
        .findUnique({
          where: {
            examType_pricingType: {
              examType: "BARRISTER",
              pricingType: "PAID",
            },
          },
        })
        .then((exam) =>
          exam
            ? prisma.question.count({ where: { examId: exam.id } })
            : 0
        ),

      prisma.exam
        .findUnique({
          where: {
            examType_pricingType: {
              examType: "SOLICITOR",
              pricingType: "FREE",
            },
          },
        })
        .then((exam) =>
          exam
            ? prisma.question.count({ where: { examId: exam.id } })
            : 0
        ),

      prisma.exam
        .findUnique({
          where: {
            examType_pricingType: {
              examType: "SOLICITOR",
              pricingType: "PAID",
            },
          },
        })
        .then((exam) =>
          exam
            ? prisma.question.count({ where: { examId: exam.id } })
            : 0
        ),

      // Recent users (last 5)
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),

      // Recent questions (last 5)
      prisma.question.findMany({
        select: {
          id: true,
          question: true,
          createdAt: true,
          exam: {
            select: {
              examType: true,
              pricingType: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    // Format recent activity
    const recentActivity = [
      ...recentUsers.map((user) => ({
        id: user.id,
        type: "user",
        action: "User registered",
        user: user.name,
        email: user.email,
        time: user.createdAt,
      })),
      ...recentQuestions.map((question) => ({
        id: question.id,
        type: "question",
        action: `Question added to ${question.exam.examType} ${question.exam.pricingType} exam`,
        user: "Admin",
        time: question.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 10);

    return NextResponse.json(
      {
        success: true,
        message: "Dashboard statistics retrieved successfully",
        data: {
          stats: {
            totalUsers,
            totalOrders,
            totalQuestions,
            examCounts: {
              barristerFree: barristerFreeQuestions,
              barristerPaid: barristerPaidQuestions,
              solicitorFree: solicitorFreeQuestions,
              solicitorPaid: solicitorPaidQuestions,
            },
          },
          recentActivity,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Dashboard GET Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to retrieve dashboard statistics",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

