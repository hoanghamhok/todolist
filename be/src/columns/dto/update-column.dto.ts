import { IsOptional, IsString, IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateColumnDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsOptional()
  position?: number;
  
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  closed?: boolean;
}
