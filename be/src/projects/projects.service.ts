import { ProjectRole } from '@prisma/client';
import { Injectable,NotFoundException  } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TasksService } from 'src/tasks/tasks.service';
import { UsersService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import * as dto from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
    constructor(
        private prisma: PrismaService,
        private tasksService: TasksService,
        private usersService: UsersService,
        private authService: AuthService,
    ) {}

    // Get Project by ID
    async getProjectByID(id: string) {
        const project = await this.prisma.project.findUnique({ where: { id } });
        if (!project) {
            throw new NotFoundException();
        }
        return project;
    }

    //Create Project
    async createProject(data:dto.CreateProjectDto) {
        const owner = await this.usersService.getUserById(data.ownerId);
        if (!owner) {
            throw new NotFoundException('User not found');
        }
        const project = await this.prisma.project.create({
            data: {
                name: data.name,
                description: data.description,
                owner: { connect: { id: owner.id } },
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        await this.prisma.projectMember.create({
            data: {
                project: { connect: { id: project.id } },
                user: { connect: { id: owner.id } },
                role: ProjectRole.MEMBER,
                joinedAt: new Date(),
            },
        });

        return project;
    }
    //Project that user join in
    async getUsersProjects(userId:string){
        return this.prisma.projectMember.findMany({
            where: { userId: userId },
            include: { project: true },
        });
    }
    //Detail Project
    async getProjectDetails(projectId:string){
        return this.prisma.project.findUnique({
            where:{id:projectId},
            include:{ owner:true, members:true, tasks:true }
        });
    }
    //Set Role Project Member
    async setProjectMemberRole(projectid:string,userId:string,role:ProjectRole){
        const projectmember = await this.prisma.projectMember.findFirst({
            where:{ projectId:projectid, userId:userId }
        });
        if (!projectmember) {
            throw new NotFoundException('Project member not found');
        }
        return this.prisma.projectMember.update({
            where: { id: projectmember.id },
            data: { role }
        });
    }
    //Delete Project
    async deleteProject(projectId:string){
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project) {
            throw new NotFoundException('Project not found');
        }
        return this.prisma.project.delete({ where: { id: projectId } });
    }
}
