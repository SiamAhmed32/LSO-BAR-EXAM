import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/server/session";
import { createNotification } from "@/lib/notifications";
import { ratelimit } from "@/lib/server/ratelimit";

// POST /api/admin/orders/[orderId]/cancel - Cancel an order (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
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

    const { orderId } = await params;

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
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
              },
            },
          },
        },
        payment: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    // Check if order is already cancelled
    if (order.status === "CANCELLED") {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Order is already cancelled",
        },
        { status: 400 }
      );
    }

    // Update order status to CANCELLED
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Create notification for order cancellation
    await createNotification({
      activityId: `order-${updatedOrder.id}`,
      activityType: "order",
      action: "Order cancelled",
      description: `Order #${updatedOrder.id.substring(0, 8)}... for $${updatedOrder.totalAmount.toFixed(2)} has been cancelled by admin`,
      userId: updatedOrder.userId,
      userEmail: updatedOrder.billingEmail || updatedOrder.user.email,
      metadata: {
        orderId: updatedOrder.id,
        amount: updatedOrder.totalAmount,
        status: "CANCELLED",
        cancelledBy: session.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order cancelled successfully. All exam attempts for this order are now disabled.",
        data: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Cancel Order Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error?.message || "Failed to cancel order",
      },
      { status: 500 }
    );
  }
}

