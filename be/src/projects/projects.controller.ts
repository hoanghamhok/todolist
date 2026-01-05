import { ProjectRole } from '@prisma/client';
import {Controller,Get,Patch,Post,Delete,Request,Body, Param, UseGuards} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateProjectMemberRoleDto } from './dto/update-project-member-role.dto';

@Controller('projects')
export class ProjectsController {
    constructor(private projectsService: ProjectsService) {}

    

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get(':id')
    async getProjectByID(@Param('id') id: string) {
        return this.projectsService.getProjectByID(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('create')
    async createProject(@Body() data: CreateProjectDto) {
        return this.projectsService.createProject(data);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('user/:userId')
    async getUsersProjects(@Param('userId') userId: string) {
        return this.projectsService.getUsersProjects(userId);
    }


    @Get('details/:projectId')
    async getProjectDetails(@Param('projectId') projectId: string) {
        return this.projectsService.getProjectDetails(projectId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch('update/:projectId')
    async setProjectMemberRole(
        @Param('projectId') projectId: string,
        @Body() body: UpdateProjectMemberRoleDto,
    ) {
        return this.projectsService.setProjectMemberRole(projectId, body.userId, body.role);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete('remove/:projectId')
    async removeProjectMember(@Param('projectId') projectId: string) {
        return this.projectsService.deleteProject(projectId);
    }
}
