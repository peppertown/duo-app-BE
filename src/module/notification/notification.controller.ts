import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  getNotificationsDocs,
  deleteNotificationDocs,
} from './docs/notification.docs';
import { NotificationService } from './notification.service';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('notification')
@ApiBearerAuth()
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @getNotificationsDocs.operation
  @getNotificationsDocs.response
  async getNotifications(@CurrentUserId() userId: number) {
    return this.notificationService.getNotifications(userId);
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
