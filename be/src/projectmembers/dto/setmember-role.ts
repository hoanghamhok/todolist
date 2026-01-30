// dto/set-member-role.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ProjectRole } from '@prisma/client';

export class SetMemberRoleDto {
  @ApiProperty({
    enum: ProjectRole,
    example: ProjectRole.ADMIN,
  })
  role: ProjectRole;
}
