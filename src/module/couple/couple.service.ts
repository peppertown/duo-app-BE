import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CoupleService {
  constructor(private readonly prisma: PrismaService) {}

  // 커플 데이터 조회
  async getCoupleData(coupleId: number) {
    try {
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
    } catch (err) {
      console.error('커플 데이터 조회 중 에러 발생', err);
      throw new HttpException(
        '커플 데이터 조회 중 오류가 발생했습니다',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 기념일 설정
  async setAnniversary(userId: number, coupleId: number, anniversary: string) {
    try {
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
    } catch (err) {
      console.error('기념일 설정 중 에러 발생');
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(
        '기념일 설정 중 오류가 발생했습니다',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 커플 이름 설정
  async setCoupleName(userId: number, coupleId: number, name: string) {
    try {
      const auth = await this.confirmCoupleAuth(userId, coupleId);
      if (!auth) {
        throw new HttpException('잘못된 접근입니다.', HttpStatus.BAD_REQUEST);
      }

      const couple = await this.prisma.couple.update({
        where: { id: coupleId },
        data: { name },
      });

      return {
        message: { code: 200, text: '커플 이름 설정이 완료되었습니다.' },
        couple: {
          id: couple.id,
          name: couple.name,
          anniversary: couple.anniversary,
        },
      };
    } catch (err) {
      console.error('커플 이름 설정 중 에러 발생', err);
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(
        '커플 이름 설정 중 오류가 발생했습니다',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 커플 관련 api 권한 확인
  async confirmCoupleAuth(userId: number, coupleId: number) {
    try {
      const coupleIds = await this.prisma.couple.findUnique({
        where: { id: coupleId },
      });

      const isValid = coupleIds.aId == userId || coupleIds.bId == userId;
      return isValid;
    } catch (err) {
      console.error('커플 권한 확인 중 에러 발생', err);

      throw new HttpException(
        '커플 권한 확인 중 오류가 발생했습니다',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
