import { Module } from '@nestjs/common';
import { TaskRemindCron } from './task-remind.job';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RiskPredictionModule } from 'src/risk-prediction/risk-prediction.module';

@Module({
  imports: [
    PrismaModule,
    NotificationsModule,
    RiskPredictionModule,
  ],
  providers: [TaskRemindCron],
})
export class TaskRemindModule {}
