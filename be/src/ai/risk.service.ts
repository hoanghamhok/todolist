import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { FeatureService } from "./feature.service";

@Injectable()
export class RiskService {
  constructor(private prisma: PrismaService,
              private featureService: FeatureService) {}

    async calculateTaskRisk(taskId: string) {

        const task = await this.prisma.task.findUnique({
        where: { id: taskId }
        });

        const activityLogs = await this.prisma.activityLog.findMany({
        where: { entityId: taskId }
        });

        const comments = await this.prisma.comment.findMany({
        where: { taskId }
        });

        const timeLogs = await this.prisma.taskTimeLog.findMany({
        where: { taskId }
        });

        const assignees = await this.prisma.taskAssignee.findMany({
        where: { taskId }
        });

        const features = this.featureService.extractFeatures(
        task,
        activityLogs,
        comments,
        timeLogs,
        assignees
        );

        const risk = this.calculateScore(features);

        return risk;
    }
    
    private calculateScore(features) {

        const normalize = (v, max = 10) =>
            Math.min(v / max, 1);

        const riskScore =
            0.35 * features.deadlineProximity +
            0.25 * normalize(features.moveCount) +
            0.15 * normalize(features.reassignCount) +
            0.15 * normalize(features.commentCount) +
            0.10 * normalize(features.totalHours);

        let riskLevel = "LOW";

        if (riskScore > 0.7) riskLevel = "HIGH";
        else if (riskScore > 0.4) riskLevel = "MEDIUM";

        return {
            riskScore: Number(riskScore.toFixed(2)),
            riskLevel
        };
    }
}