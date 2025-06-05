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
}
