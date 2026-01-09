import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ForgotPassWordResponseDto{
    @ApiProperty()
    @IsString()
    message:string;
}