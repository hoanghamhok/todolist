import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchDto } from './dto/search.dto';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(userId: string, dto: SearchDto) {
    const { q, type = 'all' } = dto;

    const tasksPromise =
      type === 'project'
        ? []
        : this.prisma.task.findMany({
            where: {
              project: {
                members: {
                  some: { userId }
                }
              },
              OR: [
                {
                  title: { contains: q, mode: 'insensitive' }
                },
                {
                  description: { contains: q, mode: 'insensitive' }
                }
              ]
            },
            include: {
              project: true,
              column: true
            },
            orderBy: {
              updated_at: 'desc'
            },
            take: 10
          });

    const projectsPromise =
      type === 'task'
        ? []
        : this.prisma.project.findMany({
            where: {
              members: {
                some: { userId }
              },
              OR: [
                {
                  name: { contains: q, mode: 'insensitive' }
                },
                {
                  description: { contains: q, mode: 'insensitive' }
                }
              ]
            },
            orderBy: {
              updated_at: 'desc'
            },
            take: 5
          });

    const [tasks, projects] = await Promise.all([
      tasksPromise,
      projectsPromise
    ]);

    return {
      tasks,
      projects
    };
  }
}