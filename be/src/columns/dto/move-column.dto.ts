import { ApiPropertyOptional } from '@nestjs/swagger';

export class MoveColumnDto {
  @ApiPropertyOptional()
  beforeColumnId?: string;

  @ApiPropertyOptional()
  afterColumnId?: string;
}