import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { TaskBlockService } from './task-block.service';
import { BlockTaskDto } from './dto/block-task.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('TaskBlock')
@Controller('tasks')
export class TaskBlockController {
  constructor(private readonly taskBlockService: TaskBlockService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/block')
  async block(@Param('id') id: string, @Body() dto: BlockTaskDto) {
    return this.taskBlockService.blockTask(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/unblock')
  async unblock(@Param('id') id: string) {
    return this.taskBlockService.unblockTask(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id/block-history')
  async getHistory(@Param('id') id: string) {
    return this.taskBlockService.getBlockHistory(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id/block-stats')
  async getStats(@Param('id') id: string) {
    return this.taskBlockService.getBlockStats(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @Get(':id/active-block')
  async getActive(@Param('id') id: string) {
    return this.taskBlockService.getActiveBlock(id);
  }
}
