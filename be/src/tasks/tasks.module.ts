// tasks.module.ts
import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TasksController } from './tasks.controller';
import { ActivityLogService } from 'src/activity-log/activity-log.service';

@Module({
  imports: [PrismaModule],
  providers: [TasksService,ActivityLogService],
  exports: [TasksService],
  controllers:[TasksController]
})
export class TasksModule {}
