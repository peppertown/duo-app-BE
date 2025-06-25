import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dayjs from 'dayjs';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {
  constructor(private readonly prisma: PrismaService) {}
  @Cron('0 0 * * *')
  async handleDeleteExpiredTodos() {
    try {
      const twoDaysAgo = dayjs().subtract(2, 'day').toDate();

      await this.prisma.todo.deleteMany({
        where: {
          createdAt: { lt: twoDaysAgo },
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
}
