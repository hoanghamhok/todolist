import { ApiProperty } from '@nestjs/swagger';
import {IsOptional,IsString,IsArray, ArrayNotEmpty,Min, IsISO8601} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  projectId: string;

  @ApiProperty()
  @IsString()
  columnId: string;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({each:true})
  assigneeIds: string[];

  @ApiProperty()
  @IsOptional()
  @IsISO8601()
  dueDate?: string;
}
