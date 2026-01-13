import {IsString,IsNotEmpty} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvitationDto{

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    email:string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    projectId:string;
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    inviterId:string;
}