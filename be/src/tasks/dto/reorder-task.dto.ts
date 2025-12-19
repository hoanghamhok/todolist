import { IsEnum, IsInt, IsString } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class ReorderTaskDto {
  @IsString()
  id: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsInt()
  order: number;
}
