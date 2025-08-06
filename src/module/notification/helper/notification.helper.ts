import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationHelper {
  constructor(private readonly prisma: PrismaService) {}

  // 유저 푸시 토큰 확인
  async getUserPushToken(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { pushToken: true },
    });

    return user.pushToken;
  }

  // 알림 DB에 저장
  async saveNotification(
    userId: number,
    type: NotificationType,
    payload: { title: string; body: string },
  ) {
    try {
      await this.prisma.notification.create({
        data: {
          userId,
          type,
          payload: JSON.stringify(payload),
        },
      });
    } catch (err) {
      console.error('알림 DB 저장 중 에러 발생', err);
      throw new HttpException(
        '알림 DB 저장 중 오류가 발생했습니다',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
