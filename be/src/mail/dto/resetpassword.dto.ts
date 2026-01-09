import {  IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";


export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  token: string;

  @ApiProperty()
  @IsNotEmpty()
  password:string;
}
