import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateColumnDto {
@ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  projectId: string;
}
