import { Controller,Get,Param } from "@nestjs/common";
import { RiskService } from "./risk.service";

@Controller("ai")
export class AiController {
  constructor(private readonly riskService: RiskService) {}

  @Get("tasks/:taskId/risk")
  async getTaskRisk(@Param("taskId") taskId: string) {
    return this.riskService.calculateTaskRisk(taskId);
  }
}