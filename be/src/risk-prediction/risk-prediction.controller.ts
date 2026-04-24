import { Controller, Get, Param } from '@nestjs/common';
import { RiskPredictionService } from './risk-prediction.service';

@Controller('risk-prediction')
export class RiskPredictionController {
  constructor(private readonly riskPredictionService: RiskPredictionService) {}

  @Get(':taskId')
  async getRiskScore(@Param('taskId') taskId: string) {
    const riskScore = await this.riskPredictionService.getRiskScore(taskId);
    return { riskScore };
  }
}
