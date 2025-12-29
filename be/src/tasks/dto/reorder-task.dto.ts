import { IsEnum, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReorderTaskDto {
  @IsString()
  @ApiProperty()
  id: string;

  @IsString()
  @ApiProperty()
  status: string;

  @IsInt()
  @ApiProperty()
  order: number;
}
