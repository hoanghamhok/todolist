import { CreateTaskDto } from "./create-task.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class CreateManyTasksDto {
  @ApiProperty({ type: [CreateTaskDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateTaskDto)
  tasks: CreateTaskDto[];
}