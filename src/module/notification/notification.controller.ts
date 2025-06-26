import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getNotifications(@CurrentUserId() userId: number) {
    return this.notificationService.getNotifications(userId);
  }

  @Delete(':notificationId ')
  @UseGuards(AuthGuard('jwt'))
  async deleteNotification(
    @CurrentUserId() userId: number,
    @Param('notificationId') notificationId: number,
  ) {
    return this.notificationService.deleteNotification(userId, notificationId);
  }
}
