import prisma from "@/lib/prisma";
import { getSession } from "@/lib/server/session";
import { ratelimit } from "@/lib/server/ratelimit";
import { NextRequest, NextResponse } from "next/server";

// GET notifications (admin only)
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
    const limit = parseInt(searchParams.get("limit") || "50");

    try {
      // Get all notifications, sorted by newest first
      const notifications = await prisma.notification.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
      });

      // Mark which notifications are read by current admin
      const notificationsWithReadStatus = notifications.map((notification) => ({
        ...notification,
        isRead: notification.readBy.includes(session.id),
      }));

      // Count unread notifications
      const unreadCount = notificationsWithReadStatus.filter(
        (n) => !n.isRead
      ).length;

      return NextResponse.json(
        {
          success: true,
          message: "Notifications retrieved successfully",
          data: {
            notifications: notificationsWithReadStatus,
            unreadCount,
          },
        },
        { status: 200 }
      );
    } catch (dbError: any) {
      // Handle case where notifications table doesn't exist yet
      const errorMessage = String(dbError?.message || "").toLowerCase();
      const errorCode = dbError?.code || "";
      
      // Check for various error codes and messages that indicate table doesn't exist
      const isTableMissing = 
        errorCode === "P2021" || 
        errorCode === "P1001" ||
        errorMessage.includes("does not exist") ||
        (errorMessage.includes("relation") && errorMessage.includes("not found")) ||
        errorMessage.includes("unknown table") ||
        (errorMessage.includes("table") && errorMessage.includes("doesn't exist")) ||
        errorMessage.includes("relation \"notifications\" does not exist") ||
        errorMessage.includes("table \"notifications\" does not exist");
      
      if (isTableMissing) {
        console.warn("Notifications table does not exist yet. Returning empty list.", {
          code: errorCode,
          message: dbError?.message,
        });
        return NextResponse.json(
          {
            success: true,
            message: "Notifications retrieved successfully",
            data: {
              notifications: [],
              unreadCount: 0,
            },
          },
          { status: 200 }
        );
      }
      
      // Log the actual error for debugging
      console.error("Database error details:", {
        code: errorCode,
        message: dbError?.message,
        name: dbError?.name,
        stack: process.env.NODE_ENV === "development" ? dbError?.stack : undefined,
      });
      
      throw dbError;
    }
  } catch (error: any) {
    console.error("Notifications GET Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to retrieve notifications",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// POST - Create or update notification (called when activities happen)
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

    const body = await request.json();
    const { activityId, activityType, action, description, userId, userEmail, metadata } = body;

    try {
      // Check if notification already exists
      const existing = await prisma.notification.findFirst({
        where: { activityId },
      });

      if (existing) {
        // Update existing notification
        const updated = await prisma.notification.update({
          where: { id: existing.id },
          data: {
            action,
            description,
            userId,
            userEmail,
            metadata: metadata || {},
          },
        });

        return NextResponse.json(
          {
            success: true,
            message: "Notification updated successfully",
            data: { notification: updated },
          },
          { status: 200 }
        );
      }

      // Create new notification
      const notification = await prisma.notification.create({
        data: {
          activityId,
          activityType,
          action,
          description,
          userId,
          userEmail,
          metadata: metadata || {},
          readBy: [],
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Notification created successfully",
          data: { notification },
        },
        { status: 201 }
      );
    } catch (dbError: any) {
      // Handle case where notifications table doesn't exist yet
      if (dbError?.code === "P2021" || dbError?.message?.includes("does not exist")) {
        console.warn("Notifications table does not exist yet. Please run migration.");
        return NextResponse.json(
          {
            error: "Database Error",
            message: "Notifications table does not exist. Please run database migration first.",
          },
          { status: 503 }
        );
      }
      throw dbError;
    }
    } catch (error: any) {
    console.error("Notifications POST Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to create notification",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// PATCH - Mark all notifications as read
export async function PATCH(request: NextRequest): Promise<NextResponse> {
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

    try {
      // Get all notifications
      const notifications = await prisma.notification.findMany();

      // Update all notifications to include current admin in readBy array
      const updatePromises = notifications.map((notification) => {
        const readBy = [...notification.readBy];
        if (!readBy.includes(session.id)) {
          readBy.push(session.id);
        }
        return prisma.notification.update({
          where: { id: notification.id },
          data: { readBy },
        });
      });

      await Promise.all(updatePromises);

      return NextResponse.json(
        {
          success: true,
          message: "All notifications marked as read",
        },
        { status: 200 }
      );
    } catch (dbError: any) {
      // Handle case where notifications table doesn't exist yet
      if (dbError?.code === "P2021" || dbError?.message?.includes("does not exist")) {
        console.warn("Notifications table does not exist yet.");
        return NextResponse.json(
          {
            error: "Database Error",
            message: "Notifications table does not exist. Please run database migration first.",
          },
          { status: 503 }
        );
      }
      throw dbError;
    }
  } catch (error: any) {
    console.error("Mark All Notifications Read Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to mark all notifications as read",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

