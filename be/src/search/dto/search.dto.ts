import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class SearchDto {
  @ApiProperty({ example: 'login' })
  @IsString()
  @MinLength(1)
  q!: string;

  @ApiPropertyOptional({ example: 'task' })
  @IsOptional()
  type?: 'task' | 'project' | 'all';
}