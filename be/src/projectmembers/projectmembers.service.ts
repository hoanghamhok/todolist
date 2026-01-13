import { ProjectsService } from './../projects/projects.service';
import { AuthService } from './../auth/auth.service';
import { UsersService } from './../user/user.service';
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InviteMemberDto } from './dto/invite-member.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProjectRole } from '@prisma/client';

@Injectable()
export class ProjectmembersService {
    constructor(
        private prisma:PrismaService,
        private usersService: UsersService,
        private projectsService:ProjectsService
    ){}

    async getProjectMembers(projectId: string) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project) {
                throw new NotFoundException('Project not found');
        }
        return this.prisma.projectMember.findMany({
                where: { projectId },
                include: { user: true },
        });
    }

    async removeMember(projectId: string, requesterId: string, userId: string) {
        await this.projectsService.getProjectByID(projectId);
        const requester = await this.prisma.projectMember.findFirst({ where: { projectId, userId: requesterId } });
        if (!requester) {
                throw new NotFoundException('Requester is not a project member');
        }

        const member = await this.prisma.projectMember.findFirst({ where: { projectId, userId } });
        if (!member) {
                throw new NotFoundException('Project member not found');
        }

        if (member.role === ProjectRole.OWNER) {
            throw new ForbiddenException('Cannot remove project owner. Transfer ownership first.');
        }

        const isSelf = requesterId === userId;
        if (!isSelf && requester.role !== ProjectRole.OWNER && requester.role !== ProjectRole.ADMIN) {
                throw new ForbiddenException('You do not have permission to remove this member');
        }

        await this.prisma.task.updateMany({ where: { projectId, assigneeId: userId }, data: { assigneeId: null } });

        await this.prisma.projectMember.delete({ where: { id: member.id } });

        return { message: 'Member removed' };
    }

    async leaveProject(projectId: string, requesterId: string) {
        const member = await this.prisma.projectMember.findFirst({ where: { projectId, userId: requesterId } });
        if (!member) {
            throw new NotFoundException('You are not a member of this project');
        }

        if (member.role === ProjectRole.OWNER) {
            throw new ForbiddenException('Project owner cannot leave. Transfer ownership before leaving.');
        }

        return this.removeMember(projectId, requesterId, requesterId);
    }
}
