import prisma from "@/lib/prisma";
import { getSession } from "@/lib/server/session";
import { ratelimit } from "@/lib/server/ratelimit";
import { NextRequest, NextResponse } from "next/server";

// GET all activities (admin only)
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Fetch all activities from different sources
    const [
      users,
      questions,
      orders,
      payments,
      examAttempts,
      contacts,
    ] = await Promise.all([
      // Users
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),

      // Questions
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
      }),

      // Orders
      prisma.order.findMany({
        select: {
          id: true,
          totalAmount: true,
          status: true,
          billingName: true,
          billingEmail: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),

      // Payments
      prisma.payment.findMany({
        select: {
          id: true,
          amount: true,
          status: true,
          createdAt: true,
          order: {
            select: {
              billingName: true,
              billingEmail: true,
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),

      // Exam Attempts
      prisma.examAttempt.findMany({
        select: {
          id: true,
          score: true,
          totalQuestions: true,
          correctCount: true,
          submittedAt: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          exam: {
            select: {
              examType: true,
              pricingType: true,
              examSet: true,
            },
          },
        },
        orderBy: { submittedAt: "desc" },
      }),

      // Contacts
      prisma.contact.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Format all activities
    const activities = [
      // User registrations
      ...users.map((user) => ({
        id: `user-${user.id}`,
        type: "user",
        action: "User registered",
        description: `${user.name} (${user.email}) registered as ${user.role}`,
        user: user.name,
        email: user.email,
        metadata: {
          role: user.role,
        },
        time: user.createdAt,
      })),

      // Questions added
      ...questions.map((question) => {
        const examSetLabel = question.exam.examSet
          ? ` Set ${question.exam.examSet.replace("SET_", "")}`
          : "";
        return {
          id: `question-${question.id}`,
          type: "question",
          action: "Question added",
          description: `Question added to ${question.exam.examType} ${question.exam.pricingType}${examSetLabel} exam`,
          user: "Admin",
          email: undefined,
          metadata: {
            examType: question.exam.examType,
            pricingType: question.exam.pricingType,
            examSet: question.exam.examSet,
          },
          time: question.createdAt,
        };
      }),

      // Orders created
      ...orders.map((order) => ({
        id: `order-${order.id}`,
        type: "order",
        action: `Order ${order.status.toLowerCase()}`,
        description: `Order #${order.id.substring(0, 8)}... for $${order.totalAmount.toFixed(2)} - ${order.status}`,
        user: order.billingName || order.user.name,
        email: order.billingEmail || order.user.email,
        metadata: {
          orderId: order.id,
          amount: order.totalAmount,
          status: order.status,
        },
        time: order.createdAt,
      })),

      // Payments
      ...payments.map((payment) => ({
        id: `payment-${payment.id}`,
        type: "payment",
        action: `Payment ${payment.status.toLowerCase()}`,
        description: `Payment of $${payment.amount.toFixed(2)} ${payment.status}`,
        user:
          payment.order.billingName || payment.order.user.name,
        email:
          payment.order.billingEmail || payment.order.user.email,
        metadata: {
          paymentId: payment.id,
          amount: payment.amount,
          status: payment.status,
        },
        time: payment.createdAt,
      })),

      // Exam attempts
      ...examAttempts.map((attempt) => {
        const examSetLabel = attempt.exam.examSet
          ? ` Set ${attempt.exam.examSet.replace("SET_", "")}`
          : "";
        return {
          id: `attempt-${attempt.id}`,
          type: "exam_attempt",
          action: "Exam submitted",
          description: `${attempt.user.name} submitted ${attempt.exam.examType} ${attempt.exam.pricingType}${examSetLabel} exam - Score: ${attempt.score.toFixed(1)}% (${attempt.correctCount}/${attempt.totalQuestions})`,
          user: attempt.user.name,
          email: attempt.user.email,
          metadata: {
            examType: attempt.exam.examType,
            pricingType: attempt.exam.pricingType,
            examSet: attempt.exam.examSet,
            score: attempt.score,
            correctCount: attempt.correctCount,
            totalQuestions: attempt.totalQuestions,
          },
          time: attempt.submittedAt,
        };
      }),

      // Contact submissions
      ...contacts.map((contact) => ({
        id: `contact-${contact.id}`,
        type: "contact",
        action: "Contact form submitted",
        description: `${contact.name} submitted a contact form`,
        user: contact.name,
        email: contact.email,
        metadata: {},
        time: contact.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    // Apply pagination
    const total = activities.length;
    const paginatedActivities = activities.slice(skip, skip + limit);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        success: true,
        message: "Activities retrieved successfully",
        data: {
          activities: paginatedActivities,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Activities GET Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to retrieve activities",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

