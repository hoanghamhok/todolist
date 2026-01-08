import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody,ApiOkResponse,ApiCreatedResponse,ApiConflictResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({description: 'User registered successfully',type: AuthResponseDto,})
  @ApiConflictResponse({description: 'Email already in use',})
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto.email, registerDto.password,registerDto.username);
  }

  @Post('login')
  @ApiOkResponse({description: 'Login successful',type: AuthResponseDto,})
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.identifier, loginDto.password);
  }

  @Post('register-admin')
  @ApiCreatedResponse({description: 'User registered successfully',type: AuthResponseDto})
  @ApiConflictResponse({description: 'Email already in use',})
  async registerAdmin(@Body()  registerDto: RegisterDto) {
    return this.authService.registerAdmin(registerDto.email, registerDto.password,registerDto.username);
  }
}