import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/server/session";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Please login to proceed with checkout",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { cartIds, billingDetails } = body;

    if (!cartIds || !Array.isArray(cartIds) || cartIds.length === 0) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Cart IDs are required",
        },
        { status: 400 }
      );
    }

    // Fetch all carts and calculate total
    const carts = await prisma.cart.findMany({
      where: {
        id: { in: cartIds },
        userId: session.id,
      },
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },
    });

    if (carts.length === 0) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "No carts found",
        },
        { status: 404 }
      );
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const cart of carts) {
      if (!cart.exam.price) {
        return NextResponse.json(
          {
            error: "Bad Request",
            message: `Exam ${cart.exam.title || cart.exam.id} does not have a price`,
          },
          { status: 400 }
        );
      }
      totalAmount += cart.exam.price;
      orderItems.push({
        examId: cart.exam.id,
        examTitle: cart.exam.title,
        price: cart.exam.price,
      });
    }

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: session.id,
        totalAmount,
        billingName: billingDetails?.firstName && billingDetails?.lastName
          ? `${billingDetails.firstName} ${billingDetails.lastName}`
          : session.name || "Customer",
        billingEmail: billingDetails?.email || session.email || "",
        billingAddress: billingDetails?.streetAddress || null,
        billingCity: billingDetails?.city || null,
        billingState: billingDetails?.state || null,
        billingPostcode: billingDetails?.postcode || null,
        billingCountry: billingDetails?.country || null,
        orderItems: {
          create: orderItems.map((item) => ({
            examId: item.examId,
            examTitle: item.examTitle,
            price: item.price,
          })),
        },
      },
    });

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: totalAmount,
        currency: "cad",
        status: "PENDING",
      },
    });

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: "cad",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: order.id,
        paymentId: payment.id,
        userId: session.id,
      },
      description: `Order for ${orderItems.length} exam(s)`,
    });

    console.log("Payment Intent created:", {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      client_secret: paymentIntent.client_secret?.substring(0, 20) + "...",
    });

    // Update payment with Stripe payment intent ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        stripePaymentId: paymentIntent.id,
        stripeClientSecret: paymentIntent.client_secret,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          clientSecret: paymentIntent.client_secret,
          orderId: order.id,
          paymentId: payment.id,
        },
        message: "Payment intent created successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Create Payment Intent Error:", error);
    console.error("Error stack:", error?.stack);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      type: error?.type,
    });
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error?.message || "Failed to create payment intent",
        details: process.env.NODE_ENV === "development" ? {
          stack: error?.stack,
          code: error?.code,
          type: error?.type,
        } : undefined,
      },
      { status: 500 }
    );
  }
}

