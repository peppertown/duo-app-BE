import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MypageService {
  constructor(private readonly prisma: PrismaService) {}

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

    return { user, partner };
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
