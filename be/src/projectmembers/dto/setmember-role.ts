// dto/set-member-role.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ProjectRole } from '@prisma/client';

export class SetMemberRoleDto {
  @ApiProperty({
    enum: ProjectRole,
    example: ProjectRole.ADMIN,
  })
  @IsEnum(ProjectRole)
  role: ProjectRole;
}
