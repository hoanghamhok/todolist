import {Controller,Get,Patch,Post,Delete,Request,Body, Param, UseGuards} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SetMemberRoleDto } from './dto/setmember-role';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
    constructor(private projectsService: ProjectsService) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('my')
    getMyProjects(@Request() req) {
    return this.projectsService.getUsersProjects(req.user.userId)
    }


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
    @Get('details/:projectId')
    async getProjectDetails(@Param('projectId') projectId: string) {
        return this.projectsService.getProjectDetails(projectId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':projectId/members/:targetUserId/role')
    setMemberRole(@Param('projectId') projectId: string,@Param('targetUserId') targetUserId: string,@Body() body:SetMemberRoleDto,@Request() req) {
        return this.projectsService.setProjectMemberRole(projectId,targetUserId,body.role,req.user.userId
    )}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch(':projectId/update')
    async updateProject(@Param('projectId') projectId:string,@Request() req,@Body() dto:UpdateProjectDto){
        return this.projectsService.updateProject(projectId,req.user.userId,dto)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete('remove/:projectId')
    async deleteProject(@Param('projectId') projectId: string,@Request() req) {
        return this.projectsService.deleteProject(projectId,req.user.userId);
    }
}
