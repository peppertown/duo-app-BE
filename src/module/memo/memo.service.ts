import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CoupleService } from '../couple/couple.service';

@Injectable()
export class MemoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly coupleService: CoupleService,
  ) {}

  async createMemo(
    userId: number,
    coupleId: number,
    memoId: number,
    content: string,
  ) {
    try {
      const coupleAuth = await this.coupleService.confirmCoupleAuth(
        userId,
        coupleId,
      );

      const memoAuth = await this.confirmMemoAuth(coupleId, memoId);

      if (!coupleAuth || !memoAuth) {
        throw new HttpException('잘못된 접근입니다.', HttpStatus.BAD_REQUEST);
      }

      await this.prisma.memoContent.create({
        data: { memoId, writerId: userId, content },
      });

      return { message: { code: 200, text: '메모가 작성되었습니다.' } };
    } catch (err) {
      console.error('메모 생성 중 에러 발생', err);
      if (err instanceof HttpException) throw err;

      throw new HttpException(
        '메모 생성 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async confirmMemoAuth(coupleId: number, memoId: number) {
    try {
      const memo = await this.prisma.memo.findUnique({ where: { id: memoId } });
      return memo.coupleId == coupleId;
    } catch (err) {
      console.error('메모 권한 확인 중 에러 발생', err);
      throw new HttpException(
        '메모 권한 확인 중 오류가 발생했습니다',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
