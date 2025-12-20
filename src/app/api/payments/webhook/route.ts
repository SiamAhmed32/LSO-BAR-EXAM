import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Webhook: payment_intent.succeeded", {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          status: paymentIntent.status,
        });
        
        // Find payment by Stripe payment intent ID
        let payment = await prisma.payment.findUnique({
          where: { stripePaymentId: paymentIntent.id },
          include: { order: true },
        });

        // Fallback: Try to find payment by orderId from metadata
        if (!payment && paymentIntent.metadata?.orderId) {
          console.log("Payment not found by stripePaymentId, trying orderId:", paymentIntent.metadata.orderId);
          payment = await prisma.payment.findUnique({
            where: { orderId: paymentIntent.metadata.orderId },
            include: { order: true },
          });
          
          // Update stripePaymentId if it was missing
          if (payment && !payment.stripePaymentId) {
            await prisma.payment.update({
              where: { id: payment.id },
              data: { stripePaymentId: paymentIntent.id },
            });
          }
        }

        if (payment) {
          console.log("Found payment in database:", {
            paymentId: payment.id,
            orderId: payment.orderId,
            currentStatus: payment.status,
          });

          // Update payment status
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: "SUCCEEDED" },
          });

          // Update order status
          await prisma.order.update({
            where: { id: payment.orderId },
            data: { status: "COMPLETED" },
          });

          console.log("Updated payment and order status to SUCCEEDED/COMPLETED");

          // Clear user's carts after successful payment
          const deletedCarts = await prisma.cart.deleteMany({
            where: { userId: payment.order.userId },
          });

          console.log(`Cleared ${deletedCarts.count} cart items for user ${payment.order.userId}`);
        } else {
          console.error("Payment not found for payment intent:", paymentIntent.id);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        const payment = await prisma.payment.findUnique({
          where: { stripePaymentId: paymentIntent.id },
        });

        if (payment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: "FAILED" },
          });

          await prisma.order.update({
            where: { id: payment.orderId },
            data: { status: "FAILED" },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

