import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { ApiTags } from '@nestjs/swagger';
import {
  handleRefreshDocs,
  kakaoLoginDocs,
  loginDocs,
  verifyGoogleSecurityCodeDocs,
} from './docs/auth.docs';
import { Response } from 'express';
import { buildGoogleOAuthUrl } from './utils/auth.utils';
import { ConfigService } from 'src/config/config.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @loginDocs.operation
  @loginDocs.body
  @loginDocs.response
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

  @Get('google')
  redirectToGoogle(@Res() res: Response) {
    const authUrl = buildGoogleOAuthUrl(this.configService);
    return res.redirect(authUrl);
  }

  @Get('google/callback')
  async handleGoogleCallback(
    @Query('code') code: string,
    @Res() res: Response,
  ) {
    const securityCode = await this.authService.generateGoogleLoginCode(code);
    const redirectUrl = `${this.configService.deeplinkUrl}?securityCode=${securityCode}`;
    return res.redirect(redirectUrl);
  }

  @Post('google/verify')
  @verifyGoogleSecurityCodeDocs.operation
  @verifyGoogleSecurityCodeDocs.body
  @verifyGoogleSecurityCodeDocs.response
  async verifyGoogleSecurityCode(@Body('securityCode') securityCode: string) {
    return await this.authService.verifyGoogleSecurityCode(securityCode);
  }

  @Post('kakao')
  @kakaoLoginDocs.operation
  @kakaoLoginDocs.body
  @kakaoLoginDocs.response
  async kakaoLogin(@Body('accessToken') accessToken: string) {
    return await this.authService.kakaoLogin(accessToken);
  }

  @Post('refresh')
  @handleRefreshDocs.operation
  @handleRefreshDocs.body
  @handleRefreshDocs.response
  async handleRefresh(
    @CurrentUserId() userId: number,
    @Body() body: { code: string },
  ) {
    return await this.authService.handleRefresh(body.code);
  }
}
