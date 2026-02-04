import { Controller, Post, Body, Get, UseGuards,Request,Response } from '@nestjs/common';
import { ApiTags,ApiBody,ApiOkResponse,ApiCreatedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
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
  async forgot(@Body() data:ForgotPasswordDto) {
    await this.authService.forgotPassword(data.email);
    return {
      message:"Check a message sent to your email"
    }
  }

  @Post('reset-password')
  @ApiCreatedResponse({type:ResetPassWordResponseDto})
  async reset(@Body() data:ResetPasswordDto) {
   await this.authService.resetPassword(data.token,data.password);
   return {
    message:"Reset password successful"
   }
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Request() req, @Response() res) {
    const { accessToken } = await this.authService.loginWithGoogle(req.user);

    res.redirect(
      `http://localhost:5173/auth/google/callback?token=${accessToken}`,
    );
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
  }
  
}