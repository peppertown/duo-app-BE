import { Injectable } from '@nestjs/common';
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
    const data = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        couplesAsA: { include: { a: true, b: true } },
        couplesAsB: { include: { a: true, b: true } },
      },
    });

    const partnerData =
      data.couplesAsA.length > 0 ? data.couplesAsA[0].b : data.couplesAsB[0].a;
    const user = this.getMypageProfile(data);
    const partner = this.getMypageProfile(partnerData);

    const coupleId =
      data.couplesAsA.length > 0
        ? data.couplesAsA[0].id
        : data.couplesAsB[0].id;

    const anniv = (await this.coupleService.getCoupleAnniversaries(coupleId))
      .anniv;

    return {
      message: { code: 200, text: '마이페이지 조회가 완료되었습니다.' },
      user,
      partner,
      anniv,
    };
  }

  // 프로필 메세지 업데이트
  async updateProfileBio(userId: number, bio: string) {
    const result = await this.prisma.user.update({
      where: { id: userId },
      data: { bio },
    });

    const user = this.getMypageProfile(result);
    return {
      message: { code: 200, text: '프로필 메세지 업데이트가 완료되었습니다.' },
      user,
    };
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
