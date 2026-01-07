import { ApiProperty } from "@nestjs/swagger";
import {IsEmail,IsNotEmpty,IsOptional,IsString,MinLength} from "class-validator";

export class LoginDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    identifier:string;

    @ApiProperty()
    @IsNotEmpty()
    password:string;
}