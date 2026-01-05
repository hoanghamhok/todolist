// ...existing code...
import { Injectable,NotFoundException,ConflictException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { UpdateTaskStatusDto } from "./dto/update-taskstatus.dto";


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
            where: { status: createTaskDto.status, projectId: createTaskDto.projectId },
            orderBy: { order: 'desc' },
            select: { order: true },
        });
        const lastOrder = last?.order ?? -1;
        const nextOrder = lastOrder + 1;

        return this.prisma.task.create({
            data:{
                title:createTaskDto.title,
                description:createTaskDto.description,
                status: createTaskDto.status,
                created_at:new Date(),
                updated_at:new Date(),
                order: nextOrder,
                project: { connect: { id: createTaskDto.projectId } },
                assignee: { connect: { id: createTaskDto.userId } },
            },
        });
    }
    
    //Update Task
    async update(id:string,updateTaskDto:UpdateTaskDto){
        const task = await this.getTaskByID(id);

        // determine target project id (if changing project, use new one; otherwise existing)
        const targetProjectId = updateTaskDto.projectId ?? task.projectId;

        // if projectId provided, ensure project exists
        if (updateTaskDto.projectId) {
            const project = await this.prisma.project.findUnique({ where: { id: updateTaskDto.projectId }});
            if (!project) throw new NotFoundException('Project not found');
        }

        // if userId provided, ensure the user is a member of the target project
        if (updateTaskDto.userId) {
            const member = await this.prisma.projectMember.findFirst({
                where: { projectId: targetProjectId, userId: updateTaskDto.userId },
            });
            if (!member) throw new ConflictException('User is not a member of the project');
        }

        // build data object for update; connect relations when ids provided
        const data: any = { ...updateTaskDto, updated_at: new Date() };
        if (updateTaskDto.projectId) {
            data.project = { connect: { id: updateTaskDto.projectId } };
            delete data.projectId;
        }
        if (updateTaskDto.userId) {
            data.assignee = { connect: { id: updateTaskDto.userId } };
            delete data.userId;
        }

        return this.prisma.task.update({
            where:{id},
            data,
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
    async getAll(){
        return this.prisma.task.findMany({
            orderBy: [
                { order: 'asc' },
                { status: 'asc' },
            ],
            select:{id:true,title:true,description:true,created_at:true,updated_at:true,status:true,order:true}
        })
    }
    
    //Update Status
    async updateStatus(id: string, dto: UpdateTaskStatusDto){
        await this.getTaskByID(id);
        return this.prisma.task.update({
            where:{id},
            data:{
                status:dto.status,
                updated_at:new Date(),
            },
        });
    }

    //Reorder task
    async reorder(tasks: { id: string; status: string; order: number }[]) {
        return this.prisma.$transaction(
          tasks.map(t =>
            this.prisma.task.update({
              where: { id: t.id },
              data: {
                status: t.status,
                order: t.order,
              },
            }),
          ),
        );
    }

    //get task by user id
    async getTasksByUserId(userId: string) {
        return this.prisma.task.findMany({
          where: { assigneeId: userId },
          orderBy: [
            { order: 'asc' },
            { status: 'asc' },
          ],
          select: { id: true, title: true, description: true, created_at: true, updated_at: true, status: true, order: true },
        });
      }

}