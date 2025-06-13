import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CoupleService } from '../couple/couple.service';

@Injectable()
export class MemoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly coupleService: CoupleService,
  ) {}

  // 메모 작성
  async createMemo(userId: number, coupleId: number, content: string) {
    try {
      const auth = await this.coupleService.confirmCoupleAuth(userId, coupleId);

      if (!auth) {
        throw new HttpException('잘못된 접근입니다.', HttpStatus.BAD_REQUEST);
      }

      const coupleMemo = await this.prisma.memo.findFirst({
        where: { coupleId },
      });

      await this.prisma.memoContent.create({
        data: { memoId: coupleMemo.id, writerId: userId, content },
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

  // 메모 조회
  async getMemo(userId: number, coupleId: number) {
    try {
      const auth = await this.coupleService.confirmCoupleAuth(userId, coupleId);
      if (!auth) {
        throw new HttpException('잘못된 접근입니다.', HttpStatus.BAD_REQUEST);
      }

      const coupleMemo = await this.prisma.memo.findFirst({
        where: { coupleId },
      });

      const data = await this.prisma.memoContent.findMany({
        where: { memoId: coupleMemo.id },
      });

      const memo = data.map((i) => ({
        id: i.id,
        isOwn: i.writerId == userId,
        content: i.content,
        createdAt: i.createdAt,
      }));

      return {
        message: { code: 200, text: '메모 조회가 완료되었습니다.' },
        memo,
      };
    } catch (err) {
      console.error('메모 조회 중 에러 발생', err);
      if (err instanceof HttpException) throw err;

      throw new HttpException(
        '메모 조회 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 메모 권한 확인
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

  // 메모 삭제
  async deleteMemo(userId: number, coupleId: number, contentId: number) {
    try {
      const auth = await this.coupleService.confirmCoupleAuth(userId, coupleId);

      if (!auth) {
        throw new HttpException('잘못된 접근입니다.', HttpStatus.BAD_REQUEST);
      }

      await this.prisma.memoContent.delete({
        where: { id: contentId },
      });

      return { message: { code: 200, text: '메모 삭제가 완료되었습니다.' } };
    } catch (err) {
      console.error('메모 삭제 중 에러 발생', err);
      if (err instanceof HttpException) throw err;

      throw new HttpException(
        '메모 삭제 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
