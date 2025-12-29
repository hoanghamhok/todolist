import { ApiProperty } from "@nestjs/swagger";
import {IsEmail,IsNotEmpty,IsString,MinLength} from "class-validator";

export class LoginDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    username:string;

    @ApiProperty()
    @IsNotEmpty()
    password:string;
}