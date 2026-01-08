import {Controller,Get,Patch,Post,Delete,Request,Body, Param} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController{
    constructor(private tasksService:TasksService){}
    
    //Get all Task
    @Get('all')
    async getTask(){
        return this.tasksService.getAll();
    }

    //Create a Task
    @Post('create')
    create(@Body() createTaskDto:CreateTaskDto){
        return this.tasksService.create(createTaskDto);
    }

    //Update a Task
    @Patch(':id')
    update (@Param('id') id:string,@Body() updateTaskDto:UpdateTaskDto){
        return this.tasksService.update(id,updateTaskDto)
    }

    //Move task
    @Patch(':id/move')
    moveTask(@Param('id') id: string,@Body() dto: MoveTaskDto,) {
    return this.tasksService.moveTask(id,dto.columnId,dto.beforeTaskId,dto.afterTaskId,);
    }

    //Delete Task
    @Delete(':id')
    remove(@Param('id') id:string){
        return this.tasksService.remove(id);
    }
    
    //Get Task by UserId
    @Get(':id')
    getByID(@Param('id') id:string){
        return this.tasksService.getTasksByUserId(id);
    }
    
}