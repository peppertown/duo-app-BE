import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  async createSchdule(
    userId: number,
    coupleId: number,
    title: string,
    start: string,
    end: string,
  ) {
    const res = await this.prisma.schedule.create({
      data: {
        userId,
        coupleId,
        title,
        start: new Date(start),
        end: new Date(end),
      },
    });

    return res;
  }

  async getMonthlySchedule(
    userId: number,
    coupleId: number,
    year: number,
    month: number,
  ) {
    try {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);

      const where: any = {
        start: { gte: start, lte: end },
      };

      if (!coupleId) where.userId = userId;
      else where.coupleId = coupleId;

      const schedule = await this.prisma.schedule.findMany({
        where,
        select: { userId: true, title: true, start: true, end: true },
        orderBy: { start: 'asc' },
      });
      return {
        message: { code: 200, text: '캘린더 조회가 완료되었습니다', schedule },
      };
    } catch (err) {
      console.error('캘린더 조회 중 에러 발생', err);
      throw new HttpException(
        '캘린더 조회 중 오류가 발생했습니다',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
