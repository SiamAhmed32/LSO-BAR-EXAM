-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT,
    "userEmail" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readBy" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notifications_activityId_idx" ON "notifications"("activityId");

-- CreateIndex
CREATE INDEX "notifications_activityType_idx" ON "notifications"("activityType");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

