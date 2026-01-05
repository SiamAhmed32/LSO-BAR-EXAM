import prisma from "@/lib/prisma";
import { getSession } from "@/lib/server/session";
import { ratelimit } from "@/lib/server/ratelimit";
import { NextRequest, NextResponse } from "next/server";

// POST - Sync activities to notifications (creates notifications from activities)
export async function POST(request: NextRequest): Promise<NextResponse> {
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

    // Fetch all activities (same logic as activities endpoint)
    const [
      users,
      questions,
      orders,
      payments,
      examAttempts,
      contacts,
    ] = await Promise.all([
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

    // Format activities
    const activities = [
      ...users.map((user) => ({
        activityId: `user-${user.id}`,
        activityType: "user",
        action: "User registered",
        description: `${user.name} (${user.email}) registered as ${user.role}`,
        userId: user.id,
        userEmail: user.email,
        metadata: { role: user.role },
        time: user.createdAt,
      })),
      ...questions.map((question) => {
        const examSetLabel = question.exam.examSet
          ? ` Set ${question.exam.examSet.replace("SET_", "")}`
          : "";
        return {
          activityId: `question-${question.id}`,
          activityType: "question",
          action: "Question added",
          description: `Question added to ${question.exam.examType} ${question.exam.pricingType}${examSetLabel} exam`,
          userId: undefined,
          userEmail: undefined,
          metadata: {
            examType: question.exam.examType,
            pricingType: question.exam.pricingType,
            examSet: question.exam.examSet,
          },
          time: question.createdAt,
        };
      }),
      ...orders.map((order) => ({
        activityId: `order-${order.id}`,
        activityType: "order",
        action: `Order ${order.status.toLowerCase()}`,
        description: `Order #${order.id.substring(0, 8)}... for $${order.totalAmount.toFixed(2)} - ${order.status}`,
        userId: order.user.name,
        userEmail: order.billingEmail || order.user.email,
        metadata: {
          orderId: order.id,
          amount: order.totalAmount,
          status: order.status,
        },
        time: order.createdAt,
      })),
      ...payments.map((payment) => ({
        activityId: `payment-${payment.id}`,
        activityType: "payment",
        action: `Payment ${payment.status.toLowerCase()}`,
        description: `Payment of $${payment.amount.toFixed(2)} ${payment.status}`,
        userId: payment.order.user.name,
        userEmail: payment.order.billingEmail || payment.order.user.email,
        metadata: {
          paymentId: payment.id,
          amount: payment.amount,
          status: payment.status,
        },
        time: payment.createdAt,
      })),
      ...examAttempts.map((attempt) => {
        const examSetLabel = attempt.exam.examSet
          ? ` Set ${attempt.exam.examSet.replace("SET_", "")}`
          : "";
        return {
          activityId: `attempt-${attempt.id}`,
          activityType: "exam_attempt",
          action: "Exam submitted",
          description: `${attempt.user.name} submitted ${attempt.exam.examType} ${attempt.exam.pricingType}${examSetLabel} exam - Score: ${attempt.score.toFixed(1)}% (${attempt.correctCount}/${attempt.totalQuestions})`,
          userId: attempt.user.name,
          userEmail: attempt.user.email,
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
      ...contacts.map((contact) => ({
        activityId: `contact-${contact.id}`,
        activityType: "contact",
        action: "Contact form submitted",
        description: `${contact.name} submitted a contact form`,
        userId: contact.name,
        userEmail: contact.email,
        metadata: {},
        time: contact.createdAt,
      })),
    ];

    // Create or update notifications
    let created = 0;
    let updated = 0;

    for (const activity of activities) {
      const existing = await prisma.notification.findFirst({
        where: { activityId: activity.activityId },
      });

      if (existing) {
        await prisma.notification.update({
          where: { id: existing.id },
          data: {
            action: activity.action,
            description: activity.description,
            userId: activity.userId || null,
            userEmail: activity.userEmail || null,
            metadata: activity.metadata || {},
          },
        });
        updated++;
      } else {
        await prisma.notification.create({
          data: {
            activityId: activity.activityId,
            activityType: activity.activityType,
            action: activity.action,
            description: activity.description,
            userId: activity.userId || null,
            userEmail: activity.userEmail || null,
            metadata: activity.metadata || {},
            readBy: [],
          },
        });
        created++;
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Notifications synced successfully",
        data: {
          created,
          updated,
          total: activities.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Notifications Sync Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to sync notifications",
      },
      { status: 500 }
    );
  }
}

