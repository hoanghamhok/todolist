import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectRole } from '@prisma/client';

export class UpdateProjectMemberRoleDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  userId: string;

  @IsNotEmpty()
  @IsEnum(ProjectRole)
  @ApiProperty({ enum: ProjectRole })
  role: ProjectRole;
}
