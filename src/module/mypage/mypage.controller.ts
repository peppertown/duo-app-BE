import { Controller, Get, UseGuards } from '@nestjs/common';
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
}
