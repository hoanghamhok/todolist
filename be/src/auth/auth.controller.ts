import { Controller, Post, Body, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody,ApiOkResponse,ApiCreatedResponse,ApiConflictResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ForgotPasswordDto } from 'src/mail/dto/forgotpassword.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({type: AuthResponseDto,})
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto.email, registerDto.password,registerDto.username);
  }

  @Post('login')
  @ApiOkResponse({type: AuthResponseDto,})
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.identifier, loginDto.password);
  }

  @Post('register-admin')
  @ApiCreatedResponse({type: AuthResponseDto})
  async registerAdmin(@Body()  registerDto: RegisterDto) {
    return this.authService.registerAdmin(registerDto.email, registerDto.password,registerDto.username);
  }

  @Post('forgot-password')
  forgot(@Body() data:ForgotPasswordDto) {
    return this.authService.forgotPassword(data.email);
  }

  @Post('reset-password')
  reset(@Body('token') token: string,@Body('password') password: string,) {
  return this.authService.resetPassword(token, password);
  }
}