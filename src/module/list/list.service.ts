import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SseService } from 'src/sse/sse.service';

@Injectable()
export class ListService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sse: SseService,
  ) {}

  private readonly notificationType = 'LIST_TOGGLED';

  // 리스트 목록 추가
  async createList(
    userId: number,
    coupleId: number,
    categoryId: number,
    content: string,
  ) {
    try {
      const coupleList = await this.prisma.list.findFirst({
        where: { coupleId },
      });

      await this.prisma.listContent.create({
        data: { listId: coupleList.id, writerId: userId, categoryId, content },
      });

      return { message: { code: 200, text: '리스트 목록이 작성되었습니다.' } };
    } catch (err) {
      console.error('리스트 목록 생성 중 에러 발생', err);
      if (err instanceof HttpException) throw err;

      throw new HttpException(
        '리스트 목록 생성 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 리스트 조회
  async getList(userId: number, coupleId: number) {
    const coupleList = await this.prisma.list.findFirst({
      where: { coupleId },
    });

    if (!coupleList)
      throw new HttpException(
        '버킷리스트 사용 전 커플 연결이 필요합니다.',
        HttpStatus.BAD_REQUEST,
      );

    const listData = await this.prisma.listContent.findMany({
      where: { listId: coupleList.id },
    });

    const list = listData.map((i) => ({
      id: i.id,
      isOwn: i.writerId == userId,
      categoryId: i.categoryId,
      content: i.content,
      isDone: i.isDone,
      createdAt: i.createdAt,
    }));

    return {
      message: { code: 200, text: '버킷 리스트 조회가 완료되었습니다.' },
      list,
    };
  }

  // 리스트 목록 완료여부 토글
  async listDoneHandler(userId: number, coupleId: number, contentId: number) {
    try {
      const listContent = await this.prisma.listContent.findUnique({
        where: { id: contentId },
        include: { category: true },
      });

      if (!listContent) {
        throw new HttpException(
          '리스트 목록을 찾을 수 없습니다.',
          HttpStatus.NOT_FOUND,
        );
      }

      const condition = {
        where: { id: contentId },
        data: { isDone: !listContent.isDone },
      };

      await this.prisma.listContent.update(condition);

      // 완료시 알림 전송
      if (!listContent.isDone) {
        const couple = await this.prisma.couple.findUnique({
          where: { id: coupleId },
        });

        const partnerId = couple.aId == userId ? couple.bId : couple.aId;

        await this.sse.createNofication(partnerId, this.notificationType, {
          id: listContent.id,
          message: `완료된 버킷리스트가 있어요!
${listContent.category.name}: ${listContent.content}`,
        });
      }

      return {
        message: { code: 200, text: '리스트 완료 여부 설정이 완료되었습니다.' },
      };
    } catch (err) {
      console.error('리스트 완료 여부 설정 중 에러 발생', err);
      if (err instanceof HttpException) throw err;

      throw new HttpException(
        '리스트 완료 여부 설정 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 리스트 목록 삭제
  async deleteList(userId: number, coupleId: number, contentId: number) {
    try {
      await this.prisma.listContent.delete({
        where: { id: contentId },
      });

      return {
        message: { code: 200, text: '리스트 목록이 삭제 삭제되었습니다.' },
      };
    } catch (err) {
      console.error('리스트 목록 삭제 중 에러 발생', err);
      if (err instanceof HttpException) throw err;

      throw new HttpException(
        '리스트 목록 삭제 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
