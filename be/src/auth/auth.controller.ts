import { Controller, Post, Body, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags,ApiBody,ApiOkResponse,ApiCreatedResponse,ApiConflictResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ForgotPasswordDto } from 'src/mail/dto/forgotpassword.dto';
import { ResetPasswordDto } from 'src/mail/dto/resetpassword.dto';
import { ForgotPassWordResponseDto } from './dto/fw-response.dto';
import { ResetPassWordResponseDto } from './dto/rs-response.dto';

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
  @ApiCreatedResponse({ type: ForgotPassWordResponseDto })
  forgot(@Body() data:ForgotPasswordDto) {
    this.authService.forgotPassword(data.email);
    return {
      message:"Vui long kiem tra thu duoc gui den tai khoan email cua ban"
    }
  }

  @Post('reset-password')
  @ApiCreatedResponse({type:ResetPassWordResponseDto})
  reset(@Body() data:ResetPasswordDto) {
   this.authService.resetPassword(data.token,data.password);
   return {
    message:"Dat lai mat khau thanh cong"
   }
  }
}