import { Controller, Post, Body, Param, Delete, Get } from '@nestjs/common';
import { TaskDependencyService } from './task-dependency.service';
import { CreateDependencyDto } from './dto/create-dependency.dto';

@Controller('tasks/:id/dependencies')
export class TaskDependencyController {
  constructor(private readonly taskDependencyService: TaskDependencyService) {}

  @Post()
  addDependency(@Param('id') taskId: string, @Body() dto: CreateDependencyDto) {
    return this.taskDependencyService.addDependency(taskId, dto);
  }

  @Delete(':dependsOnTaskId')
  removeDependency(
    @Param('id') taskId: string,
    @Param('dependsOnTaskId') dependsOnTaskId: string,
  ) {
    return this.taskDependencyService.removeDependency(taskId, dependsOnTaskId);
  }

  @Get()
  getDependencies(@Param('id') taskId: string) {
    return this.taskDependencyService.getDependencies(taskId);
  }

  @Get('status')
  getDependencyStatus(@Param('id') taskId: string) {
    return this.taskDependencyService.getDependencyStatus(taskId);
  }
}
