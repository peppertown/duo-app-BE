/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  // 유저 push token 업데이트
  async updatePushToken(userId: number, pushToken: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { pushToken },
    });

    return {
      message: { code: 200, text: 'push token 업데이트가 완료되었습니다.' },
    };
  }

  // 알림 조회
  async getNotifications(userId: number) {
    const result = await this.prisma.notification.findMany({
      where: { userId },
    });

    if (!result.length) {
      return {
        message: { code: 200, text: '알림 조회가 완료되었습니다.' },
        notifications: [],
      };
    }

    const notifications = result.map(({ userId, ...rest }) => rest);

    // 조회된 알림 읽음 처리
    await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
        id: { gte: result[0].id, lte: result[result.length - 1].id },
      },
      data: { isRead: true },
    });

    return {
      message: { code: 200, text: '알림 조회가 완료되었습니다.' },
      notifications,
    };
  }

  // 알림 개별 삭제
  async deleteNotification(userId: number, notificationId: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new HttpException(
        '알림이 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.notification.delete({
      where: { id: notificationId },
    });

    return {
      message: { code: 200, text: '알림이 삭제되었습니다.' },
    };
  }

  // 알림 전체 삭제
  async deleteAllNotification(userId: number) {
    await this.prisma.notification.deleteMany({
      where: { userId },
    });

    return {
      message: { code: 200, text: '알림 전체 삭제가 완료되었습니다.' },
    };
  }

  // 미확인 알림 조회
  async unreadNotification(userId: number) {
    const notify = await this.prisma.notification.findFirst({
      where: { userId, isRead: false },
    });
    return notify ? true : false;
  }
}
