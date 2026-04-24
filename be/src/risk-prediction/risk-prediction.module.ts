import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RiskPredictionService } from './risk-prediction.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RiskPredictionController } from './risk-prediction.controller';

@Module({
  imports: [HttpModule, PrismaModule],
  providers: [RiskPredictionService],
  controllers: [RiskPredictionController],
  exports: [RiskPredictionService],
})
export class RiskPredictionModule {}
