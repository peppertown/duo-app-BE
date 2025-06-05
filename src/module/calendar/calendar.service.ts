import { Injectable } from '@nestjs/common';
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
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const where: any = {
      start: { gte: start, lte: end },
    };

    if (!coupleId) where.userId = userId;
    else where.coupleId = coupleId;

    const res = await this.prisma.schedule.findMany({
      where,
      orderBy: { start: 'asc' },
    });
    return res;
  }
}
