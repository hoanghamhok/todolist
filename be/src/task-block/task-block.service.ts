import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlockTaskDto } from './dto/block-task.dto';

@Injectable()
export class TaskBlockService {
  constructor(private prisma: PrismaService) {}

  async blockTask(taskId: string, dto: BlockTaskDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    if (task.blocked) {
      throw new BadRequestException('Task is already blocked');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Create block record
      const block = await tx.taskBlock.create({
        data: {
          taskId,
          reason: dto.reason,
        },
      });

      // 2. Update task status
      await tx.task.update({
        where: { id: taskId },
        data: { blocked: true },
      });

      return block;
    });
  }

  async unblockTask(taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    if (!task.blocked) {
      throw new BadRequestException('Task is not blocked');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Find the active block
      const activeBlock = await tx.taskBlock.findFirst({
        where: {
          taskId,
          unblockedAt: null,
        },
        orderBy: { blockedAt: 'desc' },
      });

      if (activeBlock) {
        // 2. Close the block record
        await tx.taskBlock.update({
          where: { id: activeBlock.id },
          data: { unblockedAt: new Date() },
        });
      }

      // 3. Update task status
      return tx.task.update({
        where: { id: taskId },
        data: { blocked: false },
      });
    });
  }

  async getBlockHistory(taskId: string) {
    return this.prisma.taskBlock.findMany({
      where: { taskId },
      orderBy: { blockedAt: 'desc' },
    });
  }

  async getActiveBlock(taskId: string) {
    return this.prisma.taskBlock.findFirst({
      where: {
        taskId,
        unblockedAt: null,
      },
      orderBy: { blockedAt: 'desc' },
    });
  }

  async getBlockStats(taskId: string) {
    const blocks = await this.prisma.taskBlock.findMany({
      where: { taskId },
    });

    const blockCount = blocks.length;
    let totalBlockedDurationMs = 0;

    blocks.forEach((block) => {
      const end = block.unblockedAt || new Date();
      totalBlockedDurationMs += end.getTime() - block.blockedAt.getTime();
    });

    const totalBlockedDurationHours = totalBlockedDurationMs / (1000 * 60 * 60);

    return {
      blockCount,
      totalBlockedDurationHours,
    };
  }
}
