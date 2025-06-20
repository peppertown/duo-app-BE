import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import {
  deleteUserDocs,
  matchUserDocs,
  setUserBirthdayDocs,
  setUserNicknameDocs,
} from './docs/user.docs';
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

  @Post('birthday')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @setUserBirthdayDocs.operation
  @setUserBirthdayDocs.body
  @setUserBirthdayDocs.response
  async setUserBirthday(
    @CurrentUserId() userId: number,
    @Body('birthday') birthday: string,
  ) {
    return await this.userService.setUserBirthDay(userId, birthday);
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
  @ApiBearerAuth()
  async uploadProfileImage(
    @CurrentUserId() userId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.userService.uploadProfileImage(userId, file);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @deleteUserDocs.operation
  @deleteUserDocs.response
  async deleteUser(@CurrentUserId() userId: number) {
    return await this.userService.deleteUser(userId);
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
