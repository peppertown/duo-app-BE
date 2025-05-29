import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { googleCallbackDocs, handleRefreshDocs } from './docs/auth.docs';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return await this.authService.login(body);
  }

  @Post('register')
  async register(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ) {
    return await this.authService.register(body);
  }

  @Post('google/callback')
  @googleCallbackDocs.operation
  @googleCallbackDocs.body
  @googleCallbackDocs.response
  async googleCallback(@Body() body: { code: string }) {
    return await this.authService.googleLogin(body.code);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @handleRefreshDocs.operation
  @handleRefreshDocs.body
  @handleRefreshDocs.response
  async handleRefresh(
    @CurrentUserId() userId: number,
    @Body() body: { code: string },
  ) {
    return await this.authService.handleRefresh(userId, body.code);
  }
}
