import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/server/session";

// GET /api/admin/orders - Get all orders (admin only)
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
    const status = searchParams.get("status"); // Filter by order status
    const search = searchParams.get("search"); // Search by email or name

    // Build where clause
    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { billingEmail: { contains: search, mode: "insensitive" } },
        { billingName: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get all orders
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          orderItems: {
            include: {
              exam: {
                select: {
                  id: true,
                  examType: true,
                  examSet: true,
                  title: true,
                  attemptCount: true,
                },
              },
            },
          },
          payment: {
            select: {
              id: true,
              status: true,
              amount: true,
              currency: true,
              stripePaymentId: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    // Calculate remaining attempts for each order item
    const ordersWithAttempts = await Promise.all(
      orders.map(async (order) => {
        const orderItemsWithAttempts = await Promise.all(
          order.orderItems.map(async (item) => {
            // Only calculate for paid exams with attempt limits
            if (item.exam.attemptCount === null || item.exam.attemptCount === 0) {
              return {
                ...item,
                remainingAttempts: null, // Unlimited
                usedAttempts: 0,
                totalAttempts: null,
              };
            }

            // Count attempts made using this order item
            const usedAttempts = await prisma.examAttempt.count({
              where: {
                orderItemId: item.id,
                examId: item.examId,
              },
            });

            const remainingAttempts = Math.max(0, item.exam.attemptCount - usedAttempts);

            return {
              ...item,
              remainingAttempts,
              usedAttempts,
              totalAttempts: item.exam.attemptCount,
            };
          })
        );

        return {
          ...order,
          orderItems: orderItemsWithAttempts,
        };
      })
    );

    const totalPages = Math.ceil(total / limit);

    // Calculate summary stats
    const stats = await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
      where: {
        status: "COMPLETED",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Orders retrieved successfully",
        data: {
          orders: ordersWithAttempts,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
          stats: {
            totalOrders: stats._count.id,
            totalRevenue: stats._sum.totalAmount || 0,
          },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Admin Get Orders Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error?.message || "Failed to retrieve orders",
      },
      { status: 500 }
    );
  }
}

