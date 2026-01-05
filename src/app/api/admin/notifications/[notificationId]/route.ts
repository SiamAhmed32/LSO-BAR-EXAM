import prisma from "@/lib/prisma";
import { getSession } from "@/lib/server/session";
import { ratelimit } from "@/lib/server/ratelimit";
import { NextRequest, NextResponse } from "next/server";

// PATCH - Mark notification as read/unread
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ notificationId: string }> }
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

    const { notificationId } = await params;
    const body = await request.json();
    const { isRead } = body;

    try {
      // Get the notification
      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
      });

      if (!notification) {
        return NextResponse.json(
          { error: "Notification not found" },
          { status: 404 }
        );
      }

      // Update readBy array
      let updatedReadBy = [...notification.readBy];
      
      if (isRead) {
        // Add current admin to readBy if not already there
        if (!updatedReadBy.includes(session.id)) {
          updatedReadBy.push(session.id);
        }
      } else {
        // Remove current admin from readBy
        updatedReadBy = updatedReadBy.filter((id) => id !== session.id);
      }

      const updated = await prisma.notification.update({
        where: { id: notificationId },
        data: { readBy: updatedReadBy },
      });

      return NextResponse.json(
        {
          success: true,
          message: `Notification marked as ${isRead ? "read" : "unread"}`,
          data: {
            notification: {
              ...updated,
              isRead: updated.readBy.includes(session.id),
            },
          },
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
    console.error("Notification PATCH Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to update notification",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

