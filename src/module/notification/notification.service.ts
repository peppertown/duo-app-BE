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
        success: true,
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
}
