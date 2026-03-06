import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ActivityLogService {
  constructor(private prisma: PrismaService) {}

  async log({userId,projectId,entityType,entityId,action,metadata}) {
    return this.prisma.activityLog.create({
      data: {
        userId,
        projectId,
        entityType,
        entityId,
        action,
        metadata
      }
    });
  }
}