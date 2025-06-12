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

  // 커플 기념일 조회
  async getCoupleAnniversaries(coupleId: number) {
    try {
      const data = await this.prisma.couple.findUnique({
        where: { id: coupleId },
        include: {
          a: { select: { nickname: true, birthday: true } },
          b: { select: { nickname: true, birthday: true } },
        },
      });
      const dday = this.getDDay(data.anniversary);

      const upcoming = this.getUpcommingAnniv(dday, data.anniversary);
      const aBirth = this.getDaysToNextBirthday(data.a.birthday);
      const bBirth = this.getDaysToNextBirthday(data.b.birthday);
      const anniv = [
        upcoming,
        { type: `${data.a.nickname}님 생일`, ...aBirth },
        { type: `${data.b.nickname}님 생일`, ...bBirth },
      ];

      return {
        message: { code: 200, text: '커플 기념일 조회가 완료되었습니다.' },
        dday,
        anniv,
      };
    } catch (err) {
      console.error('커플 기념일 조회 중 에러 발생', err);

      throw new HttpException(
        '커플 기념일 조회 중 오류가 발생했습니다',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 커플 디데이 조회
  getDDay(anniversary: Date) {
    // 오늘 날짜 (한국시간)
    const today = new Date();
    const koreaOffset = 9 * 60; // KST는 UTC+9
    const todayKST = new Date(
      today.getTime() + (koreaOffset - today.getTimezoneOffset()) * 60000,
    );

    const anniv = new Date(anniversary);

    // 두 날짜의 차이 (밀리초)
    const diffTime = todayKST.getTime() - anniv.getTime();

    // 일 수 계산 (밀리초 → 일)
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return days;
  }

  // 다가오는 기념일 조회
  getUpcommingAnniv(dday: number, anniversary: Date) {
    const nextHundred = Math.ceil(dday / 100) * 100;
    const hundredDiff = nextHundred - dday;
    const nextHundredDate = new Date(
      anniversary.getTime() + nextHundred * 24 * 60 * 60 * 1000,
    );

    const nextYear = Math.ceil(dday / 365);
    const yearDiff = nextYear * 365 - dday;
    const nextYearDate = new Date(anniversary);
    nextYearDate.setFullYear(anniversary.getFullYear() + nextYear);

    if (hundredDiff < yearDiff) {
      return {
        type: `${nextHundred}일`,
        days: hundredDiff,
        date: nextHundredDate,
      };
    } else {
      return {
        type: `${nextYear}주년`,
        days: yearDiff,
        date: nextYearDate,
      };
    }
  }

  // 생일 디데이 조회
  getDaysToNextBirthday(birthday: Date) {
    const today = new Date();
    const todayKST = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    // 생일의 월/일만 고려해서 올해의 생일 날짜 객체 생성
    const birth = new Date(birthday);
    const nextBirthday = new Date(
      todayKST.getFullYear(),
      birth.getMonth(),
      birth.getDate(),
    );

    // 오늘 생일이면 0, 지났으면 내년으로
    if (todayKST.getTime() > nextBirthday.getTime()) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }

    // 차이 계산 (일 단위)
    const diff =
      (nextBirthday.getTime() - todayKST.getTime()) / (1000 * 60 * 60 * 24);

    return { days: Math.round(diff), date: nextBirthday };
  }
}
