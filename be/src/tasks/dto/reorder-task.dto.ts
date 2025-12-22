import { IsEnum, IsInt, IsString } from 'class-validator';
import { TaskStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ReorderTaskDto {
  @IsString()
  @ApiProperty()
  id: string;

  @IsEnum(TaskStatus)
  @ApiProperty()
  status: TaskStatus;

  @IsInt()
  @ApiProperty()
  order: number;
}
