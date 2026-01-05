import { ApiProperty } from '@nestjs/swagger';
import { ProjectRole } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class InviteMemberDto {
  @ApiProperty()
  @ValidateIf(o => !o.email)
  @IsString()
  userId?: string;
  
  @ApiProperty()
  @ValidateIf(o => !o.userId)
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(ProjectRole)
  role?: ProjectRole;
}
