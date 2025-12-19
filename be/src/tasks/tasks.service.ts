import { Injectable,NotFoundException,ConflictException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { UpdateTaskStatusDto } from "./dto/update-taskstatus.dto";
import { TaskStatus } from "@prisma/client";


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
        // Find the task that has the biggest order number for status TODO
        const status = 'TODO';
        const last = await this.prisma.task.findFirst({
            where: { status },
            orderBy: { order: 'desc' },
            select: { order: true },
        });
        const lastOrder = last?.order ?? -1;
        const nextOrder = lastOrder + 1;

        return this.prisma.task.create({
            data:{
                title:createTaskDto.title,
                description:createTaskDto.description,
                status:'TODO',
                created_at:new Date(),
                updated_at:new Date(),
                order: nextOrder,
            },
        });
    }
    
    //Update Task
    async update(id:string,updateTaskDto:UpdateTaskDto){
        await this.getTaskByID(id);
        return this.prisma.task.update({
            where:{id},
            data:{
                ...updateTaskDto,
                updated_at:new Date(),
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
    async reorder(tasks: { id: string; status: TaskStatus; order: number }[]) {
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

}