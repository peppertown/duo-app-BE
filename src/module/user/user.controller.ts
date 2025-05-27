import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { setUserNicknameDocs, setUserRoleDocs } from './docs/user.docs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('nickname')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @setUserNicknameDocs.operation
  @setUserNicknameDocs.body
  @setUserNicknameDocs.response
  async setUserNickname(
    @CurrentUserId() userId: number,
    @Body() body: { nickname: string },
  ) {
    return await this.userService.setUserNickname(userId, body.nickname);
  }

  @Post('role')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @setUserRoleDocs.operation
  @setUserRoleDocs.body
  @setUserRoleDocs.response
  async setUserRole(
    @CurrentUserId() userId: number,
    @Body() body: { role: string },
  ) {
    return await this.userService.setUserRole(userId, body.role);
  }
}
