import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export interface CreateListContentData {
  listId: number;
  writerId: number;
  categoryId: number;
  content: string;
}

@Injectable()
export class ListRepository {
  constructor(private readonly prisma: PrismaService) {}

  // List 테이블 메서드
  async findListByCoupleId(coupleId: number) {
    return this.prisma.list.findFirst({
      where: { coupleId },
    });
  }

  // ListContent 테이블 메서드
  async createListContent(data: CreateListContentData) {
    return this.prisma.listContent.create({
      data,
    });
  }

  async findListContentsByListId(listId: number) {
    return this.prisma.listContent.findMany({
      where: { listId },
    });
  }

  async findListContentById(id: number) {
    return this.prisma.listContent.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async updateListContent(id: number, data: { isDone: boolean }) {
    return this.prisma.listContent.update({
      where: { id },
      data,
    });
  }

  async deleteListContent(id: number) {
    return this.prisma.listContent.delete({
      where: { id },
    });
  }
}
