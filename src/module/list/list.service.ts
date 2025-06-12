import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CoupleService } from '../couple/couple.service';

@Injectable()
export class ListService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly coupleService: CoupleService,
  ) {}

  // 리스트 조회
  async getList(userId: number, coupleId: number, listId: number) {
    const auth = this.confirmAuth(userId, coupleId, listId);
    if (!auth) {
      throw new HttpException('잘못된 접근입니다.', HttpStatus.BAD_REQUEST);
    }

    const items = await this.prisma.listContent.findMany({
      where: { listId },
    });

    const list = this.formatList(items);

    return {
      message: {
        code: 200,
        text: '리스트 조회가 완료되었습니다.',
      },
      list,
    };
  }

  // 리스트 목록 추가
  async createList(
    userId: number,
    coupleId: number,
    listId: number,
    content: string,
  ) {
    try {
      const auth = this.confirmAuth(userId, coupleId, listId);
      if (!auth) {
        throw new HttpException('잘못된 접근입니다.', HttpStatus.BAD_REQUEST);
      }

      await this.prisma.listContent.create({
        data: { listId, writerId: userId, content },
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

  async listDoneHandler(
    userId: number,
    coupleId: number,
    listId: number,
    contentId: number,
  ) {
    try {
      const auth = this.confirmAuth(userId, coupleId, listId);
      if (!auth) {
        throw new HttpException('잘못된 접근입니다.', HttpStatus.BAD_REQUEST);
      }

      const listContent = await this.prisma.listContent.findUnique({
        where: { id: contentId },
      });

      const isDone = listContent.isDone;

      const condition = { where: { id: contentId }, data: { isDone: !isDone } };

      await this.prisma.listContent.update(condition);

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

  // 권한 확인 (커플 & 리스트)
  async confirmAuth(userId: number, coupleId: number, listId: number) {
    const coupleAuth = await this.coupleService.confirmCoupleAuth(
      userId,
      coupleId,
    );
    const listAuth = await this.confirmListAuth(coupleId, listId);

    return coupleAuth && listAuth;
  }

  // 리스트 권한 확인
  async confirmListAuth(coupleId: number, listId: number) {
    try {
      const list = await this.prisma.list.findUnique({
        where: { id: listId },
      });
      return list.coupleId == coupleId;
    } catch (err) {
      console.error('리스트 권한 확인 중 에러 발생', err);
      throw new HttpException(
        '리스트 권한 확인 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  formatList(list: any) {
    return list.map((i) => ({
      id: i.id,
      writerId: i.writerId,
      content: i.content,
      createdAt: i.createdAt,
      isDone: i.isDone,
    }));
  }
}
