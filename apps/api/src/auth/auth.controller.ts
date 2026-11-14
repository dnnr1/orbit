import { Body, Controller, Post, HttpCode, UseGuards, Get, Request, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { 
  RegisterUser, 
  LoginUser, 
  ForgotPassword, 
  ResetPassword,
  VerifyEmail 
} from '@orbit/shared';
import { LocalGuard } from './guards/local.guard';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() data: RegisterUser) {
    return this.authService.register(data);
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalGuard)
  async login(@Body() data: LoginUser) {
    return this.authService.login(data);
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this authService.refreshToken(refreshToken);
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() data: ForgotPassword) {
    return this authService.forgotPassword(data);
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() data: ResetPassword) {
    return this authService.resetPassword(data);
  }

  @Post('verify-email')
  @HttpCode(200)
  async verifyEmail(@Body() data: VerifyEmail) {
    return this authService.verifyEmail(data.token);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async getMe(@Request() req) {
    return this authService.getMe(req.user.id);
  }
}