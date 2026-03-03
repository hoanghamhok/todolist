import {ForbiddenException,Injectable,NotFoundException} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

    async getTaskComments(taskId: string) {
        const task = await this.prisma.task.findUnique({
        where: { id: taskId },
        });

        if (!task) throw new NotFoundException('Task not found');

        return this.prisma.comment.findMany({
        where: {
            taskId,
            deletedAt: null,
        },
        include: {
            author: {
            select: {
                id: true,
                fullName: true,
                avatarUrl: true,
            },
            },
            replies: {
            where: { deletedAt: null },
            include: {
                author: {
                select: {
                    id: true,
                    fullName: true,
                    avatarUrl: true,
                },
                },
            },
            },
            mentions: true,
        },
        orderBy: {
            createdAt: 'asc',
        },
        });
    }

    async createComment(taskId: string,userId: string,dto: CreateCommentDto,) {
        return this.prisma.$transaction(async (tx) => {
    
        const task = await tx.task.findUnique({
            where: { id: taskId },
            select: { id: true, projectId: true },
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        let parentComment:
            | { id: string; authorId: string; taskId: string }
            | null = null;

        if (dto.parentId) {
            parentComment = await tx.comment.findUnique({
            where: { id: dto.parentId },
            select: { id: true, authorId: true, taskId: true },
            });

            if (!parentComment) {
            throw new NotFoundException('Parent comment not found');
            }

            if (parentComment.taskId !== taskId) {
            throw new ForbiddenException(
                'Parent comment does not belong to this task',
            );
            }
        }

        //Validate mentions thuộc project
        const mentionIds: string[] = dto.mentions ?? [];

        let validMentionIds: string[] = [];

        if (mentionIds.length > 0) {
            const projectMembers = await tx.projectMember.findMany({
            where: {
                projectId: task.projectId,
                userId: { in: mentionIds },
            },
            select: { userId: true },
            });

            validMentionIds = projectMembers.map((m) => m.userId);

            if (validMentionIds.length !== mentionIds.length) {
            throw new ForbiddenException(
                'One or more mentioned users are not in this project',
            );
            }
        }

        // Tạo comment
        const comment = await tx.comment.create({
            data: {
            content: dto.content,
            taskId,
            authorId: userId,
            parentId: dto.parentId ?? null,
            },
        });

        //Tạo CommentMention
        const uniqueMentions = [
            ...new Set(validMentionIds.filter((id) => id !== userId)),
        ];

        if (uniqueMentions.length > 0) {
            await tx.commentMention.createMany({
            data: uniqueMentions.map((mentionedUserId) => ({
                commentId: comment.id,
                userId: mentionedUserId,
            })),
            skipDuplicates: true,
            });
        }

        //Chuẩn bị notification
        const notifications: Prisma.NotificationCreateManyInput[] = [];

        // Mention notification
        uniqueMentions.forEach((mentionedUserId) => {
            notifications.push({
            userId: mentionedUserId,
            type: 'COMMENT_MENTION',
            data: {
                commentId: comment.id,
                taskId,
                projectId: task.projectId,
                authorId: userId,
            } as Prisma.InputJsonValue,
            });
        });

        // Reply notification
        if (
            parentComment &&
            parentComment.authorId !== userId
        ) {
            notifications.push({
            userId: parentComment.authorId,
            type: 'COMMENT_REPLY',
            data: {
                commentId: comment.id,
                parentCommentId: parentComment.id,
                taskId,
                projectId: task.projectId,
                authorId: userId,
            } as Prisma.InputJsonValue,
            });
        }

        //Insert notifications
        if (notifications.length > 0) {
            await tx.notification.createMany({
            data: notifications,
            });
        }

        return comment;
        });
  }

    async updateComment(commentId: string,userId: string,dto: UpdateCommentDto) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
        });

        if (!comment) throw new NotFoundException('Comment not found');

        if (comment.authorId !== userId)
            throw new ForbiddenException('You cannot edit this comment');

        return this.prisma.comment.update({
            where: { id: commentId },
            data: {
                content: dto.content,
            },
        });
    }

    async deleteComment(commentId: string, userId: string) {
        const comment = await this.prisma.comment.findUnique({
        where: { id: commentId },
        });

        if (!comment) throw new NotFoundException('Comment not found');

        if (comment.authorId !== userId)
            throw new ForbiddenException('You cannot delete this comment');

        return this.prisma.comment.update({
            where: { id: commentId },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}