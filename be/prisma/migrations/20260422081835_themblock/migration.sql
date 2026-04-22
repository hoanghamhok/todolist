/*
  Warnings:

  - You are about to drop the column `blockedReason` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "blockedReason";

-- CreateTable
CREATE TABLE "TaskBlock" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "blockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unblockedAt" TIMESTAMP(3),

    CONSTRAINT "TaskBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaskBlock_taskId_idx" ON "TaskBlock"("taskId");

-- AddForeignKey
ALTER TABLE "TaskBlock" ADD CONSTRAINT "TaskBlock_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
