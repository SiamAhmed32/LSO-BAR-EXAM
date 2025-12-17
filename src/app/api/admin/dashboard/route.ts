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
      barristerPaidSetAQuestions,
      barristerPaidSetBQuestions,
      solicitorFreeQuestions,
      solicitorPaidSetAQuestions,
      solicitorPaidSetBQuestions,
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
        .findFirst({
          where: {
            examType: "BARRISTER",
            pricingType: "FREE",
            examSet: null,
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
            examType_pricingType_examSet: {
              examType: "BARRISTER",
              pricingType: "PAID",
              examSet: "SET_A",
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
            examType_pricingType_examSet: {
              examType: "BARRISTER",
              pricingType: "PAID",
              examSet: "SET_B",
            },
          },
        })
        .then((exam) =>
          exam
            ? prisma.question.count({ where: { examId: exam.id } })
            : 0
        ),

      prisma.exam
        .findFirst({
          where: {
            examType: "SOLICITOR",
            pricingType: "FREE",
            examSet: null,
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
            examType_pricingType_examSet: {
              examType: "SOLICITOR",
              pricingType: "PAID",
              examSet: "SET_A",
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
            examType_pricingType_examSet: {
              examType: "SOLICITOR",
              pricingType: "PAID",
              examSet: "SET_B",
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
              examSet: true,
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
      ...recentQuestions.map((question) => {
        const examSetLabel = question.exam.examSet 
          ? ` Set ${question.exam.examSet.replace('SET_', '')}`
          : '';
        return {
          id: question.id,
          type: "question",
          action: `Question added to ${question.exam.examType} ${question.exam.pricingType}${examSetLabel} exam`,
          user: "Admin",
          time: question.createdAt,
        };
      }),
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
              barristerPaidSetA: barristerPaidSetAQuestions,
              barristerPaidSetB: barristerPaidSetBQuestions,
              solicitorFree: solicitorFreeQuestions,
              solicitorPaidSetA: solicitorPaidSetAQuestions,
              solicitorPaidSetB: solicitorPaidSetBQuestions,
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

