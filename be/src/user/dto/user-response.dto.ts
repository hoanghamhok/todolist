import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: 'USER' | 'ADMIN';

  @ApiProperty()
  createdAt: string;
}
