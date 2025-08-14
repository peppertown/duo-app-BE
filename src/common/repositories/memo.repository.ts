import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export interface CreateMemoData {
  writerId: number;
  coupleId: number;
  content: string;
}

@Injectable()
export class MemoRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Memo 테이블 메서드
  async createMemo(data: CreateMemoData) {
    return this.prisma.memo.create({
      data,
      include: {
        writer: {
          select: {
            id: true,
            nickname: true,
          },
        },
        couple: {
          select: {
            aId: true,
            bId: true,
          },
        },
      },
    });
  }

  async findMemosByCoupleId(coupleId: number) {
    return this.prisma.memo.findMany({
      where: { coupleId },
      include: {
        writer: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });
  }

  async findMemoById(id: number) {
    return this.prisma.memo.findUnique({
      where: { id },
    });
  }

  async updateMemo(id: number, data: { content: string }) {
    return this.prisma.memo.update({
      where: { id },
      data,
      include: {
        writer: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });
  }

  async deleteMemo(id: number) {
    return this.prisma.memo.delete({
      where: { id },
    });
  }

  // Couple 테이블 위젯 메모 관련 메서드
  async findCoupleWidgetMemo(coupleId: number) {
    return this.prisma.couple.findUnique({
      where: { id: coupleId },
      select: { widgetMemoId: true },
    });
  }

  async findCoupleById(coupleId: number) {
    return this.prisma.couple.findUnique({
      where: { id: coupleId },
    });
  }

  async updateWidgetMemo(coupleId: number, widgetMemoId: number) {
    return this.prisma.couple.update({
      where: { id: coupleId },
      data: { widgetMemoId },
    });
  }
}
