import { Injectable,NotFoundException,ConflictException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";


@Injectable()

export class TasksService{
    constructor(private prisma:PrismaService){}
    
    //get Task by ID
    async getTaskByID(id:string){
        const task = await this.prisma.task.findUnique({where:{id}})
        if(!task){
            throw new NotFoundException();
        }
        return task;
    }
    
    //Create Task
    async create(createTaskDto:CreateTaskDto){
        // ensure project exists
        const project = await this.prisma.project.findUnique({ where: { id: createTaskDto.projectId } });
        if (!project) {
            throw new NotFoundException('Project not found');
        }
        // ensure user is member of project
        const member = await this.prisma.projectMember.findFirst({
            where: { projectId: createTaskDto.projectId, userId: createTaskDto.userId },
        });
        if (!member) {
            throw new ConflictException('User is not a member of the project');
        }

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
            assigneeId: createTaskDto.userId,
            },
        });
    }
    
    //Update Task
    async update(id: string, dto: UpdateTaskDto) {
        await this.getTaskByID(id);

        return this.prisma.task.update({
            where: { id },
            data: {
            title: dto.title,
            description: dto.description,
            assigneeId: dto.userId,
            updated_at: new Date(),
            },
        });
    }
    
    //Delete Task
    async remove(id:string){
        await this.getTaskByID(id);
        return this.prisma.task.delete({
            where:{id},
        });
    }
    
    //Find ALl Task
    async getAll() {
        return this.prisma.task.findMany({
            orderBy: [
            { columnId: 'asc' },
            { position: 'asc' },
            ],
        });
    }
    
    //Move Task
    async moveTask(
        taskId: string,
        columnId: string,
        beforeTaskId?: string,
        afterTaskId?: string,
        ) {
        const GAP = 1000;

        // Đảm bảo task tồn tại
        await this.getTaskByID(taskId);

        let newPosition: number;

        //Between 2 task
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

        //before a task
        else if (afterTaskId) {
            const afterTask = await this.prisma.task.findUnique({
            where: { id: afterTaskId },
            });

            if (!afterTask) {
            throw new Error('After task not found');
            }

            newPosition = afterTask.position - GAP;
        }

        //last
        else {
            const lastTask = await this.prisma.task.findFirst({
            where: { columnId },
            orderBy: { position: 'desc' },
            });

            newPosition = lastTask
            ? lastTask.position + GAP
            : GAP;
        }

        //Update task
        return this.prisma.task.update({
            where: { id: taskId },
            data: {
            columnId,
            position: newPosition,
            updated_at: new Date(),
            },
        });
    }

    //get task by user id
    async getTasksByUserId(userId: string) {
        return this.prisma.task.findMany({
            where: { assigneeId: userId },
            orderBy: [{ position: 'asc' }],
        });
    }

}