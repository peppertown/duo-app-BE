import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CoupleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.couple.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: { anniversary?: Date }) {
    return this.prisma.couple.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.couple.delete({
      where: { id },
    });
  }

  async findByIdWithUsers(id: number) {
    return this.prisma.couple.findUnique({
      where: { id },
      include: {
        a: { select: { nickname: true, birthday: true } },
        b: { select: { nickname: true, birthday: true } },
      },
    });
  }
}
