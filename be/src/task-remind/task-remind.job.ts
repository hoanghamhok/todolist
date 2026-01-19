import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { NotificationsService } from "src/notifications/notifications.service";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()

export class TaskRemindCron{
    constructor (
        private prisma:PrismaService,
        private notificationService:NotificationsService
    ){}

    @Cron('*/10****')
    async remindTask(){
        const now = new Date();
        const remindAt = new Date(now.getTime() + 24*60*60*1000);

        const tasks = await this.prisma.task.findMany({
            where:{
                dueDate:{
                    gte:now,lte:remindAt,
                }
            }
        })
    }
}