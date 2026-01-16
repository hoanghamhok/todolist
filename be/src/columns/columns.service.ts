import {Injectable,NotFoundException,ConflictException} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateColumnDto } from "./dto/create-column.dto";
import { UpdateColumnDto } from "./dto/update-column.dto";

@Injectable()
export class ColumnsService {
  constructor(private prisma: PrismaService) {}

  async getByProject(projectId: string) {
    return this.prisma.column.findMany({
      where: {
        projectId,
        closed: false,
      },
      orderBy: {
        position: "asc",
      },
    });
  }

  async create(dto: CreateColumnDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
    });
    if (!project) throw new NotFoundException("Project not found");
    const last = await this.prisma.column.findFirst({
      where: { projectId: dto.projectId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const nextPosition = last ? last.position + 1000 : 1000;

    return this.prisma.column.create({
      data: {
        title: dto.title,
        projectId: dto.projectId,
        position: nextPosition,
      },
    });
  }

  async update(id: string, dto: UpdateColumnDto) {
    const column = await this.prisma.column.findUnique({
      where: { id },
    });
    if (!column) throw new NotFoundException("Column not found");

    return this.prisma.column.update({
      where: { id },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
    });
  }

  async move(columnId: string,beforeColumnId?: string,afterColumnId?: string,) {
    let newPosition = 1000;

    if (beforeColumnId && afterColumnId) {
      const [before, after] = await Promise.all([
        this.prisma.column.findUnique({ where: { id: beforeColumnId } }),
        this.prisma.column.findUnique({ where: { id: afterColumnId } }),
      ]);

      if (!before || !after)
        throw new NotFoundException("Invalid column reference");

      newPosition = (before.position + after.position) / 2;
    } else if (afterColumnId) {
      const after = await this.prisma.column.findUnique({
        where: { id: afterColumnId },
      });
      if (!after) throw new NotFoundException("Invalid column reference");

      newPosition = after.position - 1000;
    } else {
      const last = await this.prisma.column.findFirst({
        where: { closed: false },
        orderBy: { position: "desc" },
      });
      newPosition = last ? last.position + 1000 : 1000;
    }

    return this.prisma.column.update({
      where: { id: columnId },
      data: { position: newPosition },
    });
  }

  async close(id: string) {
    const column = await this.prisma.column.findUnique({
      where: { id },
    });
    if (!column) throw new NotFoundException("Column not found");

    return this.prisma.column.update({
      where: { id },
      data: { closed: true },
    });
  }

  async getColumnByID(id:string){
        const column = await this.prisma.column.findUnique({where:{id}})
        if(!column){
            throw new NotFoundException();
        }
        return column;
  }

  async remove(id:string){
    await this.getColumnByID(id)
    return this.prisma.column.delete({
      where:{id}
    })
  }

}
