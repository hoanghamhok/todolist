import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/user/user.service';
import { ProjectsService } from 'src/projects/projects.service';
import { ProjectRole } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class InvitesService {
    constructor(
        private prisma: PrismaService,
        private usersService: UsersService,
        private projectsService: ProjectsService,
    ) {}

    //tạo lời mời gồm:người nhận,người gửi,dự án,token,trạng thái chưa chấp nhận,gửi thông báo
    //chấp nhận lời mời:kiểm tra token,expired,status,add user vào dự án,cập nhật trạng thái,gưi thông báo đến người gửi
    //từ chối lời mời:cập nhật trạng thái,gửi thông báo đến người gửi

    async createInvite(inviterId:string,receiverEmail:string,projectId:string){
        const inviterMember = await this.prisma.projectMember.findFirst({
            where: {projectId,userId:inviterId}
        });

        if (!inviterMember) {
            throw new ForbiddenException('You are not a member of this project');
        }

        if (
            inviterMember.role !== ProjectRole.OWNER &&
            inviterMember.role !== ProjectRole.ADMIN
        ) {
            throw new ForbiddenException('You do not have permission to invite members');
        }

        const receiver = await this.usersService.findUserByEmail(receiverEmail);
        if(!receiver){
            throw new NotFoundException('Receiver not found');
        }

        const projectmember = await this.projectsService.isUserInProject(projectId,receiver.id);
        if(projectmember){
            throw new BadRequestException('User is already a member of the project');
        }

        const token = crypto.randomBytes(16).toString('hex');
        const invite = await this.prisma.invitation.create({
            data:{
                inviterId: inviterId,
                projectId: projectId,
                email: receiverEmail,
                token: token,
                status: 'PENDING',
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 7*24*60*60*1000)
            }
        })

        await this.prisma.notification.create({
            data:{
                userId: receiver.id,
                type: 'INVITE_RECEIVED',
                createdAt: new Date(),
                read: false,
                data:{ message: `You have received an invitation to join a project.`,
                    inviteToken:token
                }
            }
        });
        
        await this.prisma.notification.create({
            data:{
                userId: inviterId,
                type: 'INVITE_SENT',
                createdAt: new Date(),
                read: false,
                data:{ message: `You have sent an invitation to ${receiver.email}.`,}
            }
        });

        return {
            id: invite.inviterId,
            email: invite.email,
            projectId: invite.projectId,
            status: 'PENDING',
            expiresAt: invite.expiresAt,
        }
    }

    async acceptInvite(token:string,userId:string){
        if(!token){
            throw new BadRequestException('Missing token');
        }
        const invite = await this.prisma.invitation.findFirst({ where:{ token:token } });
        if(!invite){
            throw new NotFoundException('Invite not found');
        }
        if(invite.expiresAt < new Date()){
            throw new BadRequestException('Invite has expired');
        }
        if(invite.status !== 'PENDING'){
            throw new BadRequestException('Invite has already been responded to');
        }
        
        await this.prisma.$transaction(async()=>{
            await this.prisma.projectMember.create({
                data:{
                    project: { connect: { id: invite.projectId } },
                    user: { connect: { id: userId } },
                    role: 'MEMBER'
                }
            })
            await this.prisma.invitation.updateMany({
                where: { id: invite.id, status: 'PENDING' },
                data: { status: 'ACCEPTED' }
            })
            await this.prisma.notification.create({
                data:{
                    userId: invite.inviterId,
                    type: 'INVITE_ACCEPTED',
                    createdAt: new Date(),
                    read: false,
                    data:{ message: `Your invitation has been accepted.`,
                        projectId:invite.projectId,
                    }
                }
            });
        });
        return { projectId: invite.projectId, role: 'MEMBER', joinedAt: new Date() };
    }

    async rejectInvite(token:string,userId:string){
        if(!token){
            throw new BadRequestException('Missing token');
        }
        const invite = await this.prisma.invitation.findUnique({ where:{ token:token } });
        if(!invite){
            throw new NotFoundException('Invite not found');
        }
        if(invite.expiresAt < new Date()){
            throw new BadRequestException('Invite has expired');
        }
        if(invite.status !== 'PENDING'){
            throw new BadRequestException('Invite has already been responded to');
        }
        await this.prisma.invitation.update({
            where:{ id: invite.id },
            data:{ status: 'REJECTED' }
        });
        await this.prisma.notification.create({
            data:{
                userId: invite.inviterId,
                type: 'INVITE_REJECTED',
                createdAt: new Date(),
                read: false,
                data:{ message: `Your invitation has been rejected.`,}
            }
        });
        return { success: true };
    }

     async getInviteByID(id:string){
        const task = await this.prisma.invitation.findUnique({where:{id}})
        if(!task){
            throw new NotFoundException();
        }
        return task;
    }

    async deleteInvite(id:string){
        await this.getInviteByID(id);
        return this.prisma.invitation.delete({
            where:{id}
        })
    }

}
