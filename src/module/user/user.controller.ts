import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('nickname')
  @UseGuards(AuthGuard('jwt'))
  async setUserNickname(
    @CurrentUserId() userId: number,
    @Body() body: { nickname: string },
  ) {
    return await this.userService.setUserNickname(userId, body.nickname);
  }

  @Post('role')
  @UseGuards(AuthGuard('jwt'))
  async setUserRole(
    @CurrentUserId() userId: number,
    @Body() body: { role: string },
  ) {
    return await this.userService.setUserRole(userId, body.role);
  }
}
