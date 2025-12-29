import {IsString,IsOptional,IsInt,IsNotEmpty} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto{

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name:string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    ownerId:string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    description:string;
    
}