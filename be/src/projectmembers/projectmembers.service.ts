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

    // Get members of a project
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

    //Invite 
    async inviteMembers(projectId: string, inviterId: string, body: InviteMemberDto) {
        await this.projectsService.getProjectByID(projectId);

        const inviterMember = await this.prisma.projectMember.findFirst({ where: { projectId, userId: inviterId } });
        if (!inviterMember) {
            throw new NotFoundException('Inviter is not a project member');
        }
        if (inviterMember.role !== ProjectRole.OWNER && inviterMember.role !== ProjectRole.ADMIN) {
            throw new ForbiddenException('You do not have permission to invite members');
        }
        let userToInvite: any = null;
        if (body?.userId) {
            userToInvite = await this.usersService.getUserById(body.userId);
        } else if (body?.email) {
            userToInvite = await this.usersService.findUserByEmail(body.email);
        } else {
            throw new BadRequestException('Provide userId or email to invite');
        }
        if (!userToInvite) {
            // create invitation record
            if (!body.email) {
                throw new BadRequestException('Email is required to invite new users');
            }
            const token = require('crypto').randomBytes(16).toString('hex');
            const invitation = await this.prisma.invitation.create({
                data: {
                    email: body.email,
                    token,
                    project: { connect: { id: projectId } },
                    inviter: { connect: { id: inviterId } },
                    role: body.role ?? ProjectRole.MEMBER,
                },
            });
            return invitation;
        }

        const existing = await this.prisma.projectMember.findFirst({ where: { projectId, userId: userToInvite.id } });
        if (existing) {
            throw new BadRequestException('User is already a project member');
        }

        const member = await this.prisma.projectMember.create({
            data: {
                project: { connect: { id: projectId } },
                user: { connect: { id: userToInvite.id } },
                role: body.role ?? ProjectRole.MEMBER,
                joinedAt: new Date(),
            },
        });

        return member;
    }

    // Remove a member from a project
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

    // Leave
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
