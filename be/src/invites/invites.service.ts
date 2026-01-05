import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/user/user.service';
import { ProjectsService } from 'src/projects/projects.service';
import * as crypto from 'crypto';

@Injectable()
export class InvitesService {
    constructor(
        private prisma: PrismaService,
        private usersService: UsersService,
        private projectsService: ProjectsService,
    ) {}

    async createInvitation(projectId: string, inviterId: string, email: string, role?: any) {
        await this.projectsService.getProjectByID(projectId);

        const token = crypto.randomBytes(16).toString('hex');

        const invitation = await this.prisma.invitation.create({
            data: {
                email,
                token,
                project: { connect: { id: projectId } },
                inviter: { connect: { id: inviterId } },
                role: role ?? 'MEMBER',
            },
        });

        return invitation;
    }

    async acceptInvitation(inviteId: string, userId: string) {
        const invite = await this.prisma.invitation.findUnique({ where: { id: inviteId } });
        if (!invite) throw new NotFoundException('Invitation not found');
        if (invite.status !== 'PENDING') throw new BadRequestException('Invitation is not pending');

        const user = await this.usersService.getUserById(userId);
        if (!user) throw new NotFoundException('User not found');
        if (user.email !== invite.email) {
            throw new ForbiddenException('This invitation is not for your account');
        }

        // ensure not already member
        const existing = await this.prisma.projectMember.findFirst({ where: { projectId: invite.projectId, userId } });
        if (!existing) {
            await this.prisma.projectMember.create({
                data: {
                    project: { connect: { id: invite.projectId } },
                    user: { connect: { id: userId } },
                    role: invite.role,
                    joinedAt: new Date(),
                },
            });
        }

        await this.prisma.invitation.update({ where: { id: inviteId }, data: { status: 'ACCEPTED' } });
        return { message: 'Invitation accepted' };
    }

    async rejectInvitation(inviteId: string, userId: string) {
        const invite = await this.prisma.invitation.findUnique({ where: { id: inviteId } });
        if (!invite) throw new NotFoundException('Invitation not found');
        if (invite.status !== 'PENDING') throw new BadRequestException('Invitation is not pending');

        const user = await this.usersService.getUserById(userId);
        if (!user) throw new NotFoundException('User not found');
        if (user.email !== invite.email) {
            throw new ForbiddenException('This invitation is not for your account');
        }

        await this.prisma.invitation.update({ where: { id: inviteId }, data: { status: 'REJECTED' } });
        return { message: 'Invitation rejected' };
    }
}
