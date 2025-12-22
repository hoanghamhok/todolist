import {Controller,Get,Patch,Post,Delete,Request,Body, Param} from '@nestjs/common';
import {ApiTags,ApiResponse} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-taskstatus.dto';
import { ReorderTaskDto } from './dto/reorder-task.dto';
import { ReorderTasksBodyDto } from './dto/update-taskstatusbody.dto';

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

    //Reorder Task
    @Patch('reorder')
    reorder(@Body() body: ReorderTasksBodyDto) {
    return this.tasksService.reorder(body.tasks);
    }

    //Update a Task
    @Patch(':id')
    update (@Param('id') id:string,@Body() updateTaskDto:UpdateTaskDto){
        return this.tasksService.update(id,updateTaskDto)
    }

    //Update Task's Status
    @Patch(':id/status')
    updateStatus(@Param('id') id: string,@Body() dto: UpdateTaskStatusDto,) {
    return this.tasksService.updateStatus(id, dto);
    }

    //Delete Task
    @Delete(':id')
    remove(@Param('id') id:string){
        return this.tasksService.remove(id);
    }
    
}