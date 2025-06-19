import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CoupleService } from '../couple/couple.service';

@Injectable()
export class MemoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly coupleService: CoupleService,
  ) {}

  // 메모 생성
  async createMemo(userId: number, coupleId: number, content: string) {
    try {
      const auth = await this.coupleService.confirmCoupleAuth(userId, coupleId);
      if (!auth) {
        throw new HttpException('잘못된 접근입니다.', HttpStatus.BAD_REQUEST);
      }

      const memo = await this.prisma.memo.create({
        data: {
          writerId: userId,
          coupleId,
          content,
        },
      });
      return {
        message: { code: 200, text: '메모가 생성되었습니다.' },
        memo: { id: memo.id },
      };
    } catch (err) {
      console.error('메모 생성 중 에러 발생', err);
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        '메모 생성 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 메모 전체 조회
  async getMemo(userId: number, coupleId: number) {
    try {
      const auth = await this.coupleService.confirmCoupleAuth(userId, coupleId);
      if (!auth) {
        throw new HttpException('잘못된 접근입니다.', HttpStatus.BAD_REQUEST);
      }
      const widgetMemo = await this.prisma.couple.findUnique({
        where: { id: coupleId },
        select: { widgetMemoId: true },
      });

      const memoData = await this.prisma.memo.findMany({
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
      const memo = memoData.map((m) => ({
        id: m.id,
        content: m.content,
        createdAt: m.createdAt,
        user: {
          id: m.writer.id,
          nickname: m.writer.nickname,
        },
        isWidgetMemo: widgetMemo.widgetMemoId === m.id,
      }));

      return { message: { code: 200, text: '메모 조회 성공' }, memo };
    } catch (err) {
      console.error('메모 조회 중 에러 발생', err);
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        '메모 조회 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
