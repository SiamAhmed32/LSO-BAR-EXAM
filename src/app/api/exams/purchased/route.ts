import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/server/session";

// GET /api/exams/purchased - Get list of purchased exam IDs for current user
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        {
          success: true,
          data: [],
          message: "User not authenticated, returning empty list",
        },
        { status: 200 }
      );
    }

    // Get all COMPLETED orders with SUCCEEDED payment for this user
    const orders = await prisma.order.findMany({
      where: {
        userId: session.id,
        status: "COMPLETED",
        payment: {
          status: "SUCCEEDED",
        },
      },
      include: {
        orderItems: {
          include: {
            exam: {
              select: {
                id: true,
                examType: true,
                examSet: true,
                pricingType: true,
              },
            },
          },
        },
      },
    });

    // Extract unique exam IDs from ALL order items across ALL orders
    const purchasedExamIds = new Set<string>();
    
    // Process all orders and collect all exam IDs
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        // Only include paid exams (not free exams)
        if (item.exam && item.exam.pricingType === "PAID") {
          purchasedExamIds.add(item.exam.id);
        }
      });
    });

    // If no exams found, return empty array
    if (purchasedExamIds.size === 0) {
      return NextResponse.json(
        {
          success: true,
          data: [],
          message: "No purchased exams found",
        },
        { status: 200 }
      );
    }
    
    // Get all purchased exams to map them
    const purchasedExams = await prisma.exam.findMany({
      where: {
        id: { in: Array.from(purchasedExamIds) },
        pricingType: "PAID",
      },
      select: {
        id: true,
        examType: true,
        examSet: true,
        attemptCount: true,
      },
    });
    
    console.log(`Found ${purchasedExams.length} exams in database`);

    // Calculate remaining attempts for each exam based on most recent purchase
    const examData = await Promise.all(
      purchasedExams.map(async (exam) => {
        if (!exam.examSet) return null;

        // Find the most recent order item for this exam
        const mostRecentOrderItem = await prisma.orderItem.findFirst({
          where: {
            examId: exam.id,
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

        // Count attempts only from the most recent purchase (orderItem)
        let attemptCount = 0;
        if (mostRecentOrderItem) {
          attemptCount = await prisma.examAttempt.count({
            where: {
              userId: session.id,
              examId: exam.id,
              orderItemId: mostRecentOrderItem.id,
            },
          });
        }

        // Calculate remaining attempts
        // If attemptCount is null or 0, it means unlimited attempts
        const totalAttempts = exam.attemptCount ?? null;
        const remainingAttempts =
          totalAttempts === null || totalAttempts === 0
            ? null // Unlimited
            : Math.max(0, totalAttempts - attemptCount);

        const examType = exam.examType.toLowerCase();
        const examSet = exam.examSet.toLowerCase().replace("_", "-");
        const frontendId = `${examType}-${examSet}`;

        return {
          frontendId,
          examId: exam.id,
          examType: exam.examType,
          examSet: exam.examSet,
          totalAttempts: totalAttempts,
          usedAttempts: attemptCount,
          remainingAttempts: remainingAttempts,
          purchasedAt: mostRecentOrderItem?.createdAt || null,
        };
      })
    );

    // Filter out null values
    const validExamData = examData.filter((exam) => exam !== null);

    // Sort by most recent purchase first (descending order by purchasedAt)
    validExamData.sort((a, b) => {
      if (!a.purchasedAt && !b.purchasedAt) return 0;
      if (!a.purchasedAt) return 1; // Put exams without purchase date at the end
      if (!b.purchasedAt) return -1;
      return new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime();
    });

    // Log for debugging
    console.log(`Returning ${validExamData.length} purchased exams for user ${session.id}`);
    validExamData.forEach((exam) => {
      console.log(`- ${exam.frontendId} (${exam.examType} ${exam.examSet})`);
    });

    return NextResponse.json(
      {
        success: true,
        data: validExamData,
        message: "Purchased exams retrieved successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get Purchased Exams Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error?.message || "Failed to retrieve purchased exams",
      },
      { status: 500 }
    );
  }
}

