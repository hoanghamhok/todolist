import { FeatureService } from './feature.service';
import { AiController } from "./ai.controller";
import { Module } from "@nestjs/common";
import { RiskService } from "./risk.service";

@Module({
  controllers: [AiController],
  providers: [RiskService, FeatureService]
})
export class AiModule {}