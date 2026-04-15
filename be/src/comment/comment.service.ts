import {ForbiddenException,Injectable,NotFoundException} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ActivityLogService } from 'src/activity-log/activity-log.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService,
              private activityLogService:ActivityLogService,) {}

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
            mentions: {
                include: {
                user: {
                    select: {
                    id: true,
                    fullName: true,
                    avatarUrl: true,
                    },
                },
                },
            },
        },
        orderBy: {
            createdAt: 'asc',
        },
        });
    }



    async createComment(taskId: string, userId: string, dto: CreateCommentDto) {

        return this.prisma.$transaction(async (tx) => {

            const extractMentionsFromContent = (content: string): string[] => {
            const mentionPattern = /@([a-zA-Z0-9._-]+)/g;
            const matches = [...content.matchAll(mentionPattern)];
            return [...new Set(matches.map(m => m[1].toLowerCase()))];
            };

            const task = await tx.task.findUnique({
            where: { id: taskId },
            select: { id: true, projectId: true },
            });

            if (!task) throw new NotFoundException('Task not found');

            // parent comment
            let parentComment: { id: string; authorId: string; taskId: string } | null = null;

            if (dto.parentId) {
            parentComment = await tx.comment.findUnique({
                where: { id: dto.parentId },
                select: { id: true, authorId: true, taskId: true },
            });

            if (!parentComment) throw new NotFoundException('Parent comment not found');

            if (parentComment.taskId !== taskId) {
                throw new ForbiddenException('Parent comment does not belong to this task');
            }
            }

            // parse mention từ content 
            const usernames = extractMentionsFromContent(dto.content);

            let validMentionUsers: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
            username: string;
            }[] = [];

            if (usernames.length > 0) {
            const projectMembers = await tx.projectMember.findMany({
                where: {
                projectId: task.projectId,
                user: {
                    username: { in: usernames },
                },
                },
                include: {
                user: {
                    select: {
                    id: true,
                    fullName: true,
                    avatarUrl: true,
                    username: true,
                    },
                },
                },
            });

            validMentionUsers = projectMembers.map((m) => m.user);

            if (validMentionUsers.length !== usernames.length) {
                throw new ForbiddenException(
                'One or more mentioned users are not in this project'
                );
            }
            }

            //  remove self + unique
            const uniqueMentions = [
            ...new Map(validMentionUsers.map((u) => [u.id, u])).values(),
            ].filter((u) => u.id !== userId);

            //  create comment
            const comment = await tx.comment.create({
            data: {
                content: dto.content,
                taskId,
                authorId: userId,
                parentId: dto.parentId ?? null,
            },
            include: {
                author: {
                select: {
                    id: true,
                    fullName: true,
                    avatarUrl: true,
                    username: true, //  FIX
                },
                },
            },
            });

            //  create mention
            if (uniqueMentions.length > 0) {
            await tx.commentMention.createMany({
                data: uniqueMentions.map((u) => ({
                commentId: comment.id,
                userId: u.id,
                })),
                skipDuplicates: true,
            });
            }

            const notifications: Prisma.NotificationCreateManyInput[] = [];

            const parentAuthorId = parentComment?.authorId;

            //  mention notification
            uniqueMentions
            .filter((u) => u.id !== parentAuthorId)
            .forEach((u) => {
                notifications.push({
                userId: u.id,
                type: 'COMMENT_MENTION',
                data: {
                    message: `${comment.author.fullName} đã nhắc bạn trong 1 bình luận`,
                    actorId: comment.author.id,
                    actorName: comment.author.fullName,
                    actorAvatar: comment.author.avatarUrl,
                    commentId: comment.id,
                    taskId,
                    projectId: task.projectId,
                } as Prisma.InputJsonValue,
                });
            });

            // reply notification
            if (parentComment && parentAuthorId !== userId) {
            notifications.push({
                userId: parentAuthorId!,
                type: 'COMMENT_REPLY',
                data: {
                message: `${comment.author.fullName} đã trả lời bình luận của bạn`,
                actorId: comment.author.id,
                actorName: comment.author.fullName,
                actorAvatar: comment.author.avatarUrl,
                commentId: comment.id,
                parentCommentId: parentComment.id,
                taskId,
                projectId: task.projectId,
                } as Prisma.InputJsonValue,
            });
            }

            //  task comment notification
            if (!parentComment) {
            const taskAssignees = await tx.taskAssignee.findMany({
                where: { taskId },
            });

            const alreadyNotifiedIds = new Set<string>();
            uniqueMentions.forEach((u) => alreadyNotifiedIds.add(u.id));
            alreadyNotifiedIds.add(userId);

            if (parentAuthorId) {
                alreadyNotifiedIds.add(parentAuthorId); // FIX
            }

            taskAssignees.forEach((a) => {
                if (!alreadyNotifiedIds.has(a.userId)) {
                notifications.push({
                    userId: a.userId,
                    type: 'TASK_COMMENT',
                    data: {
                    message: `${comment.author.fullName} đã bình luận về task của bạn`,
                    actorId: comment.author.id,
                    actorName: comment.author.fullName,
                    actorAvatar: comment.author.avatarUrl,
                    commentId: comment.id,
                    taskId,
                    projectId: task.projectId,
                    } as Prisma.InputJsonValue,
                });
                }
            });
            }

            if (notifications.length > 0) {
            await tx.notification.createMany({ data: notifications });
            }

           
            await this.activityLogService.log({
            userId,
            projectId: task.projectId,
            entityType: 'COMMENT',
            entityId: comment.id,
            action: 'COMMENT_CREATED',
            metadata: {
                taskId,
                content: dto.content,
                parentId: dto.parentId ?? null,
                mentions: uniqueMentions.map((u) => u.id),
                isReply: !!dto.parentId,
            },
            });

            return comment;
        });
    }

    async updateComment(commentId: string,userId: string,dto: UpdateCommentDto) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
            select: {
            id: true,
            authorId: true,
            taskId: true,
            content: true,
            task: {
                select: { projectId: true },
            },
            },
        });

        if (!comment) throw new NotFoundException('Comment not found');

        if (comment.authorId !== userId)
            throw new ForbiddenException('You cannot edit this comment');

        const updated = await this.prisma.comment.update({
            where: { id: commentId },
            data: {
            content: dto.content,
            },
        });

        await this.activityLogService.log({
            userId,
            projectId: comment.task.projectId,
            entityType: 'COMMENT',
            entityId: comment.id,
            action: 'COMMENT_UPDATED',
            metadata: {
            taskId: comment.taskId,
            oldContent: comment.content,
            newContent: dto.content,
            },
        });

        return updated;
    }

    async deleteComment(commentId: string, userId: string) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
            select: {
            id: true,
            authorId: true,
            taskId: true,
            content: true,
            parentId: true,
            task: {
                select: { projectId: true },
            },
            },
        });

        if (!comment) throw new NotFoundException('Comment not found');

        if (comment.authorId !== userId)
            throw new ForbiddenException('You cannot delete this comment');

        const deleted = await this.prisma.comment.delete({
            where: { id: commentId },
        });

        await this.activityLogService.log({
            userId,
            projectId: comment.task.projectId,
            entityType: 'COMMENT',
            entityId: comment.id,
            action: 'COMMENT_DELETED',
            metadata: {
            taskId: comment.taskId,
            content: comment.content,
            parentId: comment.parentId,
            isReply: !!comment.parentId,
            },
        });

        return deleted;
    }


}