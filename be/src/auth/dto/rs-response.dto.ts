import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ResetPassWordResponseDto{
    @ApiProperty()
    @IsString()
    message:string;
}