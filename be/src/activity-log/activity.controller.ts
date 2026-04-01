import {Controller,Get,Request,UseGuards} from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('activity-logs')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

    @Get('activities')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    getAllActivities(@Request() req) {
    return this.activityLogService.getAllActivitiesForUser(req.user.userId);
    }
}