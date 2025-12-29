import { ProjectRole } from '@prisma/client';
import {Controller,Get,Patch,Post,Delete,Request,Body, Param} from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
    constructor(private projectsService: ProjectsService) {}

    @Get(':id')
    async getProjectByID(@Param('id') id: string) {
        return this.projectsService.getProjectByID(id);
    }

    @Post('create')
    async createProject(@Body() data: any) {
        return this.projectsService.createProject(data);
    }

    @Get('user/:userId')
    async getUsersProjects(@Param('userId') userId: string) {
        return this.projectsService.getUsersProjects(userId);
    }

    @Get('details/:projectId')
    async getProjectDetails(@Param('projectId') projectId: string) {
        return this.projectsService.getProjectDetails(projectId);
    }

    @Patch('update/:projectId')
    async setProjectMemberRole(@Param('projectId') projectId: string,userId:string,role:ProjectRole) {
        return this.projectsService.setProjectMemberRole(projectId,userId,role);
    }

    @Delete('remove/:projectId')
    async removeProjectMember(@Param('projectId') projectId: string) {
        return this.projectsService.deleteProject(projectId);
    }
}
