// tasks.module.ts
import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TasksController } from './tasks.controller';
import { ActivityLogService } from 'src/activity-log/activity-log.service';

import { TaskDependencyModule } from '../task-dependency/task-dependency.module';

@Module({
  imports: [PrismaModule, TaskDependencyModule],
  providers: [TasksService,ActivityLogService],
  exports: [TasksService],
  controllers:[TasksController]
})
export class TasksModule {}
