import { IsEnum, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateTaskStatusDto {
    @ApiProperty()
    @IsString()
    status:string; 
  }
  