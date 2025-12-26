import { IsEnum } from "class-validator";
import { TaskStatus } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateTaskStatusDto {
    @ApiProperty()
    @IsEnum(TaskStatus)
    status: TaskStatus; 
  }
  