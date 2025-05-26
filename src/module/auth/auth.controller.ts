import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { id: string; password: string }) {}

  @Post('register')
  async register(
    @Body()
    body: {
      id: string;
      password: string;
      nickname: string;
      role: string;
    },
  ) {}
}
