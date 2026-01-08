// tasks.module.ts
import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TasksController } from './tasks.controller';

@Module({
  imports: [PrismaModule],
  providers: [TasksService],
  exports: [TasksService],
  controllers:[TasksController]
})
export class TasksModule {}
