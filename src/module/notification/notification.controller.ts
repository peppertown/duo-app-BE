import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  getNotificationsDocs,
  deleteNotificationDocs,
  deleteAllNotificationDocs,
  updatePushTokenDocs,
} from './docs/notification.docs';
import { NotificationService } from './notification.service';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('notification')
@ApiBearerAuth()
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('token')
  @UseGuards(AuthGuard('jwt'))
  @updatePushTokenDocs.operation
  @updatePushTokenDocs.body
  @updatePushTokenDocs.response
  async updatePushToken(
    @CurrentUserId() userId: number,
    @Body('token') token: string,
  ) {
    return await this.notificationService.updatePushToken(userId, token);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @getNotificationsDocs.operation
  @getNotificationsDocs.response
  async getNotifications(@CurrentUserId() userId: number) {
    return this.notificationService.getNotifications(userId);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @deleteAllNotificationDocs.operation
  @deleteAllNotificationDocs.response
  async deleteAllNotification(@CurrentUserId() userId: number) {
    return await this.notificationService.deleteAllNotification(userId);
  }

  @Delete(':notificationId')
  @UseGuards(AuthGuard('jwt'))
  @deleteNotificationDocs.operation
  @deleteNotificationDocs.param
  @deleteNotificationDocs.response
  async deleteNotification(
    @CurrentUserId() userId: number,
    @Param('notificationId') notificationId: number,
  ) {
    return this.notificationService.deleteNotification(userId, notificationId);
  }
}
