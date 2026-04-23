import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDependencyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  dependsOnTaskId: string;
}
