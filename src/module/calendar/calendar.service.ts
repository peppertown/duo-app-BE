import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  async createSchdule(
    userId: number,
    coupleId: number,
    date: string,
    content: string,
  ) {
    const res = await this.prisma.schedule.create({
      data: { userId, date: new Date(date), content, coupleId },
    });

    return res;
  }

  async getMonthlySchedule(
    userId: number,
    coupleId: number,
    year: number,
    month: number,
  ) {
    const start = new Date(year, month - 1, 1); // 해당 월 1일 00:00
    const end = new Date(year, month, 1); // 다음 달 1일 00:00

    const where: any = {
      date: {
        gte: start,
        lt: end,
      },
    };

    where.coupleId = coupleId;

    return await this.prisma.schedule.findMany({ where });
  }
}
