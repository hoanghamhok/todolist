import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class BlockTaskDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reason: string;
}
