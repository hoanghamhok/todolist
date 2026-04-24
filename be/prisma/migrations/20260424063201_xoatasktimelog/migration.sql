/*
  Warnings:

  - You are about to drop the `TaskTimeLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TaskTimeLog" DROP CONSTRAINT "TaskTimeLog_taskId_fkey";

-- DropForeignKey
ALTER TABLE "TaskTimeLog" DROP CONSTRAINT "TaskTimeLog_userId_fkey";

-- DropTable
DROP TABLE "TaskTimeLog";
