import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Request,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { CreateManyTasksDto } from './dto/create-tasks.dto';
import { RiskPredictionService } from '../risk-prediction/risk-prediction.service';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService,private riskPredictionService: RiskPredictionService) {}

  @Get()
  async getAllTasks() {
    return this.tasksService.getAll();
  }

  @Get('my-tasks')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getMyTasks(@Request() req) {
    return this.tasksService.getTasksByUserId(req.user.userId);
  }

  @Get('project/:projectId')
  async getByProjectID(@Param('projectId') projectId: string) {
    return this.tasksService.getTasksByProjectId(projectId);
  }

  @Get('detail/:id')
  async getByID(@Param('id') id: string) {
    return this.tasksService.getTaskByID(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    return this.tasksService.create(createTaskDto, req.user.userId);
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  bulkCreate(@Body() createManyTasksDto: CreateManyTasksDto, @Request() req) {
    return this.tasksService.bulkCreate(createManyTasksDto, req.user.userId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const updatedTask = await this.tasksService.update(id, updateTaskDto);
    const newRiskScore = await this.riskPredictionService.getRiskScore(id);
    return {
      ...updatedTask,
      riskScore: newRiskScore,
    }
  }

  @Patch(':id/move')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  moveTask(
    @Param('id') id: string,
    @Body() dto: MoveTaskDto,
    @Request() req,
  ) {
    return this.tasksService.moveTask(
      id,
      dto.columnId,
      req.user.userId,
      dto.beforeTaskId,
      dto.afterTaskId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}