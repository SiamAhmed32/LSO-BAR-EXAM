import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/server/session";

// PUT /api/orders/[orderId]/update-status - Update order status (for payment confirmation)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Please login",
        },
        { status: 401 }
      );
    }

    const { orderId } = await params;
    const body = await request.json();
    const { status, paymentStatus } = body;

    // Find order and verify it belongs to the user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { 
        payment: true,
        orderItems: true,
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

    // Verify order belongs to user (unless admin)
    if (order.userId !== session.id && session.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "You don't have permission to update this order",
        },
        { status: 403 }
      );
    }

    // Update order status
    const updateData: any = {};
    if (status) {
      updateData.status = status;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    // Update payment status if provided
    if (paymentStatus) {
      // Find payment by orderId (one-to-one relationship)
      const payment = await prisma.payment.findUnique({
        where: { orderId: order.id },
      });

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: paymentStatus },
        });
      } else {
        console.warn(`Payment not found for order ${order.id}`);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order status updated successfully",
        data: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update Order Status Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error?.message || "Failed to update order status",
      },
      { status: 500 }
    );
  }
}

