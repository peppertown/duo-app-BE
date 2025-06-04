import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CoupleService {
  constructor(private readonly prisma: PrismaService) {}

  // 커플 데이터 조회
  async getCoupleData(coupleId: number) {
    const couple = await this.prisma.couple.findUnique({
      where: { id: coupleId },
    });

    return {
      message: { code: 200, text: '커플 데이터 조회에 성공했습니다.' },
      couple: {
        id: couple.id,
        name: couple.name,
        anniversary: couple.anniversary,
      },
    };
  }

  // 기념일 설정
  async setAnniversary(userId: number, coupleId: number, anniversary: string) {
    const auth = await this.confirmCoupleAuth(userId, coupleId);
    if (!auth) {
      throw new HttpException('잘못된 접근입니다.', HttpStatus.BAD_REQUEST);
    }

    const couple = await this.prisma.couple.update({
      where: { id: coupleId },
      data: { anniversary: new Date(anniversary) },
    });

    return {
      message: { code: 200, text: '기념일 설정이 완료되었습니다.' },
      couple: {
        id: couple.id,
        name: couple.name,
        anniversary: couple.anniversary,
      },
    };
  }

  // 커플 관련 api 권한 확인
  async confirmCoupleAuth(userId: number, coupleId: number) {
    const coupleIds = await this.prisma.couple.findUnique({
      where: { id: coupleId },
    });

    const isValid = coupleIds.aId == userId || coupleIds.bId == userId;
    return isValid;
  }
}
