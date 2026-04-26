import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { NotificationsService } from "src/notifications/notifications.service";
import { PrismaService } from "src/prisma/prisma.service";
import { RiskPredictionService } from "src/risk-prediction/risk-prediction.service";

@Injectable()
export class TaskRemindCron {
    private readonly logger = new Logger(TaskRemindCron.name);

    // cache chống spam (taskId -> timestamp)
    private expiringCache = new Map<string, number>();
    private riskCache = new Map<string, number>();

    constructor(
        private prisma: PrismaService,
        private notificationService: NotificationsService,
        private riskPredictionService: RiskPredictionService
    ) { }

    @Cron(CronExpression.EVERY_HOUR)
    async checkTasks() {
        this.logger.log('Starting task check...');

        try {
            const now = Date.now();
            const tomorrow = new Date(now + 24 * 60 * 60 * 1000);

            // =========================
            // 1. EXPIRING TASKS
            // =========================
            const expiringTasks = await this.prisma.task.findMany({
                where: {
                    dueDate: {
                        gte: new Date(now),
                        lte: tomorrow,
                    },
                    completedAt: null,
                },
                include: { assignees: true }
            });

            this.logger.log(`Expiring tasks: ${expiringTasks.length}`);

            await Promise.all(
                expiringTasks.map(async (task) => {
                    const lastNotified = this.expiringCache.get(task.id);

                    // chỉ gửi lại sau 6h
                    if (lastNotified && now - lastNotified < 6 * 60 * 60 * 1000) {
                        return;
                    }

                    await Promise.all(
                        task.assignees.map(assignee =>
                            this.notificationService.createNotification(
                                assignee.userId,
                                'TASK_EXPIRING',
                                {
                                    taskId: task.id,
                                    title: task.title,
                                    dueDate: task.dueDate,
                                    message: `Công việc "${task.title}" sắp hết hạn vào lúc ${new Date(task.dueDate as Date).toLocaleString('vi-VN', {
                                        timeZone: 'Asia/Ho_Chi_Minh'
                                    })
                                        }.`,
                                }
                            )
                        )
                    );

                    this.expiringCache.set(task.id, now);
                })
            );

            // =========================
            // 2. RISK TASKS
            // =========================
            const activeTasks = await this.prisma.task.findMany({
                where: {
                    completedAt: null,
                },
                include: { assignees: true }
            });

            this.logger.log(`Active tasks: ${activeTasks.length}`);

            await Promise.all(
                activeTasks.map(async (task) => {
                    try {
                        const riskScore = await this.riskPredictionService.getRiskScore(task.id);

                        if (riskScore < 0.7) return;

                        const lastNotified = this.riskCache.get(task.id);

                        // chỉ gửi lại sau 3h
                        if (lastNotified && now - lastNotified < 3 * 60 * 60 * 1000) {
                            return;
                        }

                        await Promise.all(
                            task.assignees.map(assignee =>
                                this.notificationService.createNotification(
                                    assignee.userId,
                                    'TASK_HIGH_RISK',
                                    {
                                        taskId: task.id,
                                        title: task.title,
                                        riskScore,
                                        message: `Công việc "${task.title}" có rủi ro cao (${(riskScore * 100).toFixed(0)}%).`,
                                    }
                                )
                            )
                        );

                        this.riskCache.set(task.id, now);

                    } catch (err) {
                        this.logger.warn(`Risk check failed for task ${task.id}`);
                    }
                })
            );

            this.logger.log('Task check completed.');

        } catch (err) {
            this.logger.error('Cron job failed', err.stack);
        }
    }
}