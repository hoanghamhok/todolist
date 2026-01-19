import { Injectable,NotFoundException,ConflictException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";


@Injectable()

export class TasksService{
    constructor(private prisma:PrismaService){}
    
    async getTaskByID(id:string){
        const task = await this.prisma.task.findUnique({where:{id}})
        if(!task){
            throw new NotFoundException();
        }
        return task;
    }
    
    async create(createTaskDto:CreateTaskDto){
        const project = await this.prisma.project.findUnique({ where: { id: createTaskDto.projectId } });
        if (!project) {
            throw new NotFoundException('Project not found');
        }
        const members = await this.prisma.projectMember.findMany({
        where: {projectId: createTaskDto.projectId,userId: {in: createTaskDto.assigneeIds}},
        select: { userId: true },
        });

        if (members.length !== createTaskDto.assigneeIds.length) {
        throw new ConflictException('One or more assignees are not members of the project')}

        const last = await this.prisma.task.findFirst({
            where: { columnId:createTaskDto.columnId },
            orderBy: { position: 'desc' },
            select: { position: true },
        });

        const nextPosition = last ? last.position + 1000 : 1000;

        return this.prisma.task.create({
            data: {
            title: createTaskDto.title,
            description: createTaskDto.description,
            position: nextPosition,
            projectId: createTaskDto.projectId,
            columnId: createTaskDto.columnId,
            assignees: {
            create: createTaskDto.assigneeIds.map(userId => ({
                user: {
                connect: { id: userId },
                },
            })),
            },
        },
});
    }
    
    async update(id: string, dto: UpdateTaskDto) {
        await this.getTaskByID(id);
        return this.prisma.task.update({
            where: { id },
            data: {
            title: dto.title,
            description: dto.description,
            updated_at: new Date(),
            assignees: dto.assigneeIds
                ? {
                    deleteMany: {},
                    create: dto.assigneeIds.map(userId => ({
                    user: {
                        connect: { id: userId },
                    },
                    })),
                }
                : undefined,
            },
            include: {
            assignees: {
                include: { user: true },
            },
            },
        });
    }
    
    async remove(id:string){
        await this.getTaskByID(id);
        return this.prisma.task.delete({
            where:{id},
        });
    }
    
    async getAll() {
        return this.prisma.task.findMany({
            orderBy: [
            { columnId: 'asc' },
            { position: 'asc' },
            ],
        });
    }
    
    async moveTask(
        taskId: string,
        columnId: string,
        beforeTaskId?: string,
        afterTaskId?: string,
        ) {
        const GAP = 1000;

        await this.getTaskByID(taskId);

        let newPosition: number;

        if (beforeTaskId && afterTaskId) {
            const beforeTask = await this.prisma.task.findUnique({
            where: { id: beforeTaskId },
            });

            const afterTask = await this.prisma.task.findUnique({
            where: { id: afterTaskId },
            });

            if (!beforeTask || !afterTask) {
            throw new Error('Before or After task not found');
            }

            newPosition = (beforeTask.position + afterTask.position) / 2;
        }

        else if (afterTaskId) {
            const afterTask = await this.prisma.task.findUnique({
            where: { id: afterTaskId },
            });

            if (!afterTask) {
            throw new Error('After task not found');
            }

            newPosition = afterTask.position - GAP;
        }

        else {
            const lastTask = await this.prisma.task.findFirst({
            where: { columnId },
            orderBy: { position: 'desc' },
            });

            newPosition = lastTask
            ? lastTask.position + GAP
            : GAP;
        }

        return this.prisma.task.update({
            where: { id: taskId },
            data: {
            columnId,
            position: newPosition,
            updated_at: new Date(),
            },
        });
    }

    async getTasksByUserId(userId: string) {
        return this.prisma.task.findMany({
            where: {
            assignees: {some: {userId: userId}}},
            orderBy: {position: 'asc'},
            include: {
            assignees: {
                include: {
                user: true}
            }},
        });
    }


    async getTasksByProjectId(projectId: string) {
        return this.prisma.task.findMany({
            where: { projectId },
            orderBy: [{ position: 'asc' }],
        });
    }

}