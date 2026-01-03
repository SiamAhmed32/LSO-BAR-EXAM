import prisma from "@/lib/prisma";

/**
 * Create a notification for an activity
 * This function is safe to call even if the notifications table doesn't exist yet
 */
export async function createNotification(data: {
  activityId: string;
  activityType: string;
  action: string;
  description: string;
  userId?: string | null;
  userEmail?: string | null;
  metadata?: any;
}): Promise<void> {
  try {
    // Check if notification already exists
    const existing = await prisma.notification.findFirst({
      where: { activityId: data.activityId },
    });

    if (existing) {
      // Update existing notification
      await prisma.notification.update({
        where: { id: existing.id },
        data: {
          action: data.action,
          description: data.description,
          userId: data.userId || null,
          userEmail: data.userEmail || null,
          metadata: data.metadata || {},
        },
      });
    } else {
      // Create new notification
      const notification = await prisma.notification.create({
        data: {
          activityId: data.activityId,
          activityType: data.activityType,
          action: data.action,
          description: data.description,
          userId: data.userId || null,
          userEmail: data.userEmail || null,
          metadata: data.metadata || {},
          readBy: [],
        },
      });
    }
  } catch (error: any) {
    // Check if notifications table doesn't exist yet
    const errorMessage = String(error?.message || "").toLowerCase();
    const isTableMissing = 
      error?.code === "P2021" ||
      error?.code === "P1001" ||
      errorMessage.includes("does not exist") ||
      (errorMessage.includes("relation") && errorMessage.includes("not found")) ||
      errorMessage.includes("unknown table") ||
      (errorMessage.includes("table") && errorMessage.includes("doesn't exist")) ||
      errorMessage.includes("relation \"notifications\" does not exist");

    if (isTableMissing) {
      console.error("❌ Notifications table does not exist! Please run the database migration:", {
        code: error?.code,
        message: error?.message,
        hint: "Run: npx prisma migrate deploy or execute the migration SQL manually",
      });
      return;
    }
    
    // Log other errors but don't throw - we don't want to break the main flow
    console.error("❌ Failed to create notification:", {
      activityId: data.activityId,
      error: error?.message,
      code: error?.code,
    });
  }
}

