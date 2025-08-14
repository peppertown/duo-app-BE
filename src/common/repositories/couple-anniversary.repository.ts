import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export interface CreateAnniversaryData {
  coupleId: number;
  title: string;
  date: Date;
}

export interface UpdateAnniversaryData {
  title?: string;
  date?: Date;
}

@Injectable()
export class CoupleAnniversaryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAnniversaryData) {
    return this.prisma.coupleAnniversary.create({
      data,
    });
  }

  async update(id: number, data: UpdateAnniversaryData) {
    return this.prisma.coupleAnniversary.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.coupleAnniversary.delete({
      where: { id },
    });
  }

  async findManyByCoupleId(coupleId: number) {
    return this.prisma.coupleAnniversary.findMany({
      where: { coupleId },
      orderBy: { date: 'asc' },
    });
  }
}