import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WidgetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCoupleId(coupleId: number) {
    return this.prisma.widget.findFirst({
      where: { coupleId },
    });
  }

  async updateByCoupleId(coupleId: number, data: { photoUrl: string }) {
    return this.prisma.widget.updateMany({
      where: { coupleId },
      data,
    });
  }
}