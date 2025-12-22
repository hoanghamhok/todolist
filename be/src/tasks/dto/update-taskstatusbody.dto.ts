import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ReorderTaskDto } from "./reorder-task.dto";

export class ReorderTasksBodyDto {
    @ValidateNested({ each: true })
    @Type(() => ReorderTaskDto)
    @ApiProperty({ type: () => [ReorderTaskDto] })
    tasks: ReorderTaskDto[];
  }