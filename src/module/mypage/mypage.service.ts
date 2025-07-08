import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CoupleService } from '../couple/couple.service';

@Injectable()
export class MypageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly coupleService: CoupleService,
  ) {}

  // 마이페이지 조회
  async getMypage(userId: number) {
    try {
      const data = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          couplesAsA: { include: { a: true, b: true } },
          couplesAsB: { include: { a: true, b: true } },
        },
      });

      const user = this.getMypageProfile(data);

      if (!data.couplesAsA.length && !data.couplesAsB.length) {
        return {
          message: { code: 200, text: '마이페이지 조회가 완료되었습니다.' },
          user,
          partner: null,
          anniv: null,
        };
      }

      const coupleId =
        data.couplesAsA.length > 0
          ? data.couplesAsA[0].id
          : data.couplesAsB[0].id;

      const anniv = (await this.coupleService.getCoupleAnniversaries(coupleId))
        .anniv;

      return {
        message: { code: 200, text: '마이페이지 조회가 완료되었습니다.' },
        anniv,
      };
    } catch (err) {
      console.error('마이페이지 조회 중 에러 발생', err);
      throw new HttpException(
        '마이페이지 조회 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getMypageProfile(user: any) {
    return {
      id: user.id,
      nickname: user.nickname,
      profileUrl: user.profileUrl,
      bio: user.bio,
      themeId: user.themeId,
    };
  }
}
