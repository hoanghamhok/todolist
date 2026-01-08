import {IsString,IsOptional,IsInt,IsNotEmpty} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto{
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    title:string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    description?:string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    columnId:string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    userId:string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    projectId:string;
}