import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateProjectDto{

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    title?:string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?:string;
}