import { Module } from '@nestjs/common';
import { TaskDependencyService } from './task-dependency.service';
import { TaskDependencyController } from './task-dependency.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TaskDependencyController],
  providers: [TaskDependencyService],
  exports: [TaskDependencyService],
})
export class TaskDependencyModule {}
