import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: 'cmjs1ns1l0001cnkisqt9i0l5',
  })
  id: string;

  @ApiProperty({
    example: 'user1@example.com',
  })
  email: string;

  @ApiProperty({
    example: 'USER',
    enum: ['USER', 'ADMIN'],
  })
  role: 'USER' | 'ADMIN';

  @ApiProperty({
    example: '2025-12-30T03:45:16.473Z',
  })
  createdAt: string;
}
