import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthDto } from './dto/google-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { id: string; password: string }) {
    return await this.authService.login(body);
  }

  @Post('register')
  async register(
    @Body()
    body: {
      id: string;
      password: string;
      nickname: string;
      role: string;
    },
  ) {
    return await this.authService.register(body);
  }

  @Post('google/callback')
  async googleCallback(@Body() body: GoogleAuthDto) {
    return await this.authService.googleLogin(body.code);
  }
}
