import { Injectable } from '@nestjs/common';
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
      couple: { id: couple.id, name: couple.name, anniversary: couple.aId },
    };
  }
}
