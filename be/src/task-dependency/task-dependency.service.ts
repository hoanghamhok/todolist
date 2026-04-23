import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDependencyDto } from './dto/create-dependency.dto';

@Injectable()
export class TaskDependencyService {
  constructor(private prisma: PrismaService) {}

  async addDependency(taskId: string, dto: CreateDependencyDto) {
    const { dependsOnTaskId } = dto;

    if (taskId === dependsOnTaskId) {
      throw new BadRequestException('Task cannot depend on itself');
    }
    // Check if tasks exist
    const [task, dependsOnTask] = await Promise.all([
      this.prisma.task.findUnique({ where: { id: taskId } }),
      this.prisma.task.findUnique({ where: { id: dependsOnTaskId } }),
    ]);
    
    if (!task || !dependsOnTask) {
      throw new NotFoundException('Task not found');
    }
    // Kiểm tra cùng project
    if (task.projectId !== dependsOnTask.projectId) {
        throw new BadRequestException('Cannot create dependency across different projects');
    }
    // Check duplicate
    const existing = await this.prisma.taskDependency.findUnique({
      where: {
        taskId_dependsOnTaskId: {
          taskId,
          dependsOnTaskId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Dependency already exists');
    }

    // Prevent circular dependency
    const isCircular = await this.checkCircular(taskId, dependsOnTaskId);
    if (isCircular) {
      throw new BadRequestException('Circular dependency detected');
    }

    return this.prisma.taskDependency.create({
      data: {
        taskId,
        dependsOnTaskId,
      },
      include: {
        dependsOn: true,
      },
    });
  }

  async removeDependency(taskId: string, dependsOnTaskId: string) {
    return this.prisma.taskDependency.delete({
      where: {
        taskId_dependsOnTaskId: {
          taskId,
          dependsOnTaskId,
        },
      },
    });
  }

  async getDependencies(taskId: string) {
    return this.prisma.taskDependency.findMany({
      where: { taskId },
      include: {
        dependsOn: {
          include: {
            column: true,
          },
        },
      },
    });
  }

  async checkDependencyBlocked(taskId: string): Promise<boolean> {
    const dependencies = await this.prisma.taskDependency.findMany({
      where: { taskId },
      include: {
        dependsOn: true,
      },
    });

    // If ANY dependsOnTask.completedAt is null -> return true
    return dependencies.some((dep) => dep.dependsOn.completedAt === null);
  }

  async getDependencyStatus(taskId: string) {
    const dependencies = await this.prisma.taskDependency.findMany({
      where: { taskId },
      include: {
        dependsOn: true,
      },
    });

    const dependencyCount = dependencies.length;
    const unresolvedDependencies = dependencies.filter(
      (dep) => dep.dependsOn.completedAt === null,
    ).length;

    return {
      dependencyCount,
      unresolvedDependencies,
      isBlocked: unresolvedDependencies > 0,
    };
  }

  private async checkCircular(taskId: string, dependsOnTaskId: string): Promise<boolean> {
    // Start from the task we are going to depend on (B)
    // and see if it already depends on our task (A)
    const visited = new Set<string>();
    const queue = [dependsOnTaskId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (currentId === taskId) return true;
      if (visited.has(currentId)) continue;
      visited.add(currentId);

      const deps = await this.prisma.taskDependency.findMany({
        where: { taskId: currentId },
      });

      for (const dep of deps) {
        queue.push(dep.dependsOnTaskId);
      }
    }
    return false;
  }
}
