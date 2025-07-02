import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MypageService } from './mypage.service';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('mypage')
export class MypageController {
  constructor(private readonly mypageService: MypageService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getMypage(@CurrentUserId() userId: number) {
    return this.mypageService.getMypage(userId);
  }

  @Post('bio')
  @UseGuards(AuthGuard('jwt'))
  updateProfileBio(@CurrentUserId() userId: number, @Body('bio') bio: string) {
    return this.mypageService.updateProfileBio(userId, bio);
  }
}
