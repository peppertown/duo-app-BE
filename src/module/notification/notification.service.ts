/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  // 알림 조회
  async getNotifications(userId: number) {
    try {
      const result = await this.prisma.notification.findMany({
        where: { userId },
      });

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
    } catch (error) {
      console.error('알림 조회 중 에러 발생', error);
      throw new HttpException(
        '알림 조회 중 오류가 발생했습니다..',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 알림 삭제
  async deleteNotification(userId: number, notificationId: number) {
    try {
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
    } catch (err) {
      console.error('알림 삭제 중 에러 발생', err);
      throw new HttpException(
        '알림 삭제 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 미확인 알림 조회
  async unreadNotification(userId: number) {
    try {
      const notify = await this.prisma.notification.findFirst({
        where: { userId, isRead: false },
      });
      return notify ? true : false;
    } catch (err) {
      console.error('미확인 알림 조회 중 에러 발생', err);
      throw new HttpException(
        '미확인 알림 조회 중 오류가 발생했습니다..',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
