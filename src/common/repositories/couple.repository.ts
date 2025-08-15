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
export class CoupleRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Couple 테이블 메서드
  async findById(id: number) {
    return this.prisma.couple.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.couple.findFirst({
      where: {
        OR: [{ aId: userId }, { bId: userId }],
      },
    });
  }

  async create(data: { aId: number; bId: number; anniversary: Date }) {
    return this.prisma.couple.create({
      data,
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

  async findUsersById(coupleId: number) {
    return this.prisma.couple.findUnique({
      where: { id: coupleId },
      select: {
        a: {
          select: {
            id: true,
            nickname: true,
            profileUrl: true,
            code: true,
            birthday: true,
          },
        },
        b: {
          select: {
            id: true,
            nickname: true,
            profileUrl: true,
            code: true,
            birthday: true,
          },
        },
      },
    });
  }

  async findPartnerByUserAndCoupleId(userId: number, coupleId: number) {
    if (!coupleId) return null;

    const couple = await this.findUsersById(coupleId);
    if (!couple) return null;

    // userId가 아닌 다른 사용자(파트너) 반환
    if (couple.a.id !== userId) {
      const { id, nickname, profileUrl, code, birthday } = couple.a;
      return { id, nickname, profileUrl, code, birthday };
    } else if (couple.b.id !== userId) {
      const { id, nickname, profileUrl, code, birthday } = couple.b;
      return { id, nickname, profileUrl, code, birthday };
    }

    return null;
  }

  async findPartnerIdByUserAndCoupleId(
    userId: number,
    coupleId: number,
  ): Promise<number | null> {
    const couple = await this.prisma.couple.findUnique({
      where: { id: coupleId },
      select: { aId: true, bId: true },
    });

    if (!couple) return null;

    return couple.aId === userId ? couple.bId : couple.aId;
  }

  // CoupleAnniversary 테이블 메서드
  async createAnniversary(data: CreateAnniversaryData) {
    return this.prisma.coupleAnniversary.create({
      data,
    });
  }

  async updateAnniversary(id: number, data: UpdateAnniversaryData) {
    return this.prisma.coupleAnniversary.update({
      where: { id },
      data,
    });
  }

  async deleteAnniversary(id: number) {
    return this.prisma.coupleAnniversary.delete({
      where: { id },
    });
  }

  async findAnniversariesByCoupleId(coupleId: number) {
    return this.prisma.coupleAnniversary.findMany({
      where: { coupleId },
      orderBy: { date: 'asc' },
    });
  }

  // Widget 테이블 메서드
  async createWidget(coupleId: number, photoUrl: string) {
    return this.prisma.widget.create({
      data: {
        coupleId,
        photoUrl,
      },
    });
  }

  async findWidgetByCoupleId(coupleId: number) {
    return this.prisma.widget.findFirst({
      where: { coupleId },
    });
  }

  async updateWidgetByCoupleId(coupleId: number, data: { photoUrl: string }) {
    return this.prisma.widget.updateMany({
      where: { coupleId },
      data,
    });
  }
}
