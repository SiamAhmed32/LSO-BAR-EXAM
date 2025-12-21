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

    // Extract unique exam IDs from order items
    const purchasedExamIds = new Set<string>();
    
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        // Only include paid exams (not free exams)
        if (item.exam.pricingType === "PAID") {
          purchasedExamIds.add(item.exam.id);
        }
      });
    });

    // Map database exam IDs to frontend exam IDs
    const examIdMap: Record<string, string> = {};
    
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
      },
    });

    // Map to frontend IDs
    purchasedExams.forEach((exam) => {
      if (!exam.examSet) return; // Skip if examSet is null
      const examType = exam.examType.toLowerCase();
      const examSet = exam.examSet.toLowerCase().replace("_", "-");
      const frontendId = `${examType}-${examSet}`;
      examIdMap[exam.id] = frontendId;
    });

    // Return frontend exam IDs
    const frontendExamIds = Object.values(examIdMap);

    return NextResponse.json(
      {
        success: true,
        data: frontendExamIds,
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

