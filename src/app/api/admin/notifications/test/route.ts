import prisma from "@/lib/prisma";
import { getSession } from "@/lib/server/session";
import { NextRequest, NextResponse } from "next/server";
import { createNotification } from "@/lib/notifications";

// GET - Test notification creation
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

    // Try to create a test notification
    await createNotification({
      activityId: `test-${Date.now()}`,
      activityType: "test",
      action: "Test notification",
      description: "This is a test notification to verify the system is working",
      userId: session.id,
      userEmail: session.email,
      metadata: { test: true },
    });

    // Try to fetch notifications to verify table exists
    try {
      const count = await prisma.notification.count();
      return NextResponse.json(
        {
          success: true,
          message: "Notification system is working!",
          data: {
            tableExists: true,
            totalNotifications: count,
            testNotificationCreated: true,
          },
        },
        { status: 200 }
      );
    } catch (error: any) {
      const errorMessage = String(error?.message || "").toLowerCase();
      if (
        error?.code === "P2021" ||
        errorMessage.includes("does not exist") ||
        errorMessage.includes("relation")
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Notifications table does not exist",
            error: "Please run the database migration first",
            instructions: {
              option1: "Run: npx prisma migrate deploy",
              option2: "Or execute the SQL from: prisma/migrations/20250101000000_add_notifications/migration.sql",
            },
            data: {
              tableExists: false,
            },
          },
          { status: 503 }
        );
      }
      throw error;
    }
  } catch (error: any) {
    console.error("Test notification error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to test notifications",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

