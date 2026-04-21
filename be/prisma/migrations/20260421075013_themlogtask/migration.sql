-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
