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
    @IsInt()
    @ApiProperty()
    order:number

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    status:string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    userId:string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    projectId:string;
}