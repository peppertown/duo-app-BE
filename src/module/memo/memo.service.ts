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
}
