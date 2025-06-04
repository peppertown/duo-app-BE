import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { matchUserDocs, setUserNicknameDocs } from './docs/user.docs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Post('match')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @matchUserDocs.operation
  @matchUserDocs.body
  @matchUserDocs.response
  async matchUser(@CurrentUserId() userId: number, @Body('code') code: string) {
    return await this.userService.matchUser(userId, code);
  }

  @Post('image')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(
    @CurrentUserId() userId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.userService.uploadProfileImage(userId, file);
  }

  // @Post('role')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth()
  // @setUserRoleDocs.operation
  // @setUserRoleDocs.body
  // @setUserRoleDocs.response
  // async setUserRole(
  //   @CurrentUserId() userId: number,
  //   @Body() body: { userRoleDto: UserRoleDto },
  // ) {
  //   return await this.userService.setUserRole(userId, body.userRoleDto);
  // }
}
