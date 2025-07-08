import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cron } from '@nestjs/schedule';
import { subDays } from 'date-fns';

@Injectable()
export class CronService {
  constructor(private readonly prisma: PrismaService) {}
  // 시간 지난 투두 삭제
  @Cron('0 0 * * *')
  async handleDeleteExpiredTodos() {
    try {
      const aDayAgo = subDays(new Date(), 1);

      await this.prisma.todo.deleteMany({
        where: {
          createdAt: { lt: aDayAgo },
        },
      });
    } catch (error) {
      console.error('만료된 투두 목록 제거 중 에러 발생', error);
      throw new HttpException(
        '만료된 투두 목록 제거 중 에러가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 확인되고 5일 지난 알림 삭제
  @Cron('0 0 * * *')
  async handleDeleteExpiredNotifications() {
    try {
      const fiveDaysAgo = subDays(new Date(), 5);

      await this.prisma.notification.deleteMany({
        where: {
          isRead: true,
          createdAt: { lt: fiveDaysAgo },
        },
      });
    } catch (error) {
      console.error('만료된 알림 제거 중 에러 발생', error);
      throw new HttpException(
        '만료된 알림 제거 중 에러가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
