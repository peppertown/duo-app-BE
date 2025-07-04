import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { addDays, addYears, differenceInCalendarDays, set } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class CoupleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) {}

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

  // 커플 기념일 등록
  async addAnniversary(
    userId: number,
    coupleId: number,
    title: string,
    anniversary: Date,
  ) {
    try {
      const auth = await this.confirmCoupleAuth(userId, coupleId);
      if (!auth) {
        throw new HttpException('잘못된 접근입니다.', HttpStatus.BAD_REQUEST);
      }

      const anniv = await this.prisma.coupleAnniversary.create({
        data: {
          title,
          coupleId,
          date: new Date(anniversary),
        },
      });

      const days = this.getDays(anniv.date);

      return {
        message: { code: 200, text: '기념일 등록이 완료되었습니다.' },
        anniv: {
          id: anniv.id,
          title: anniv.title,
          date: anniv.date,
          days,
        },
      };
    } catch (err) {
      console.error('기념일 등록 중 에러 발생', err);
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(
        '기념일 등록 중 오류가 발생했습니다.',
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

  // 커플 위젯 조회
  async getCoupleWidget(userId: number, coupleId: number) {
    try {
      const auth = await this.confirmCoupleAuth(userId, coupleId);
      if (!auth) {
        throw new HttpException('잘못된 접근입니다.', HttpStatus.BAD_REQUEST);
      }

      const widget = await this.prisma.widget.findFirst({
        where: {
          coupleId: coupleId,
        },
      });

      const photoUrl = widget.photoUrl
        ? widget.photoUrl
        : process.env.DEFAULT_WIDGET_URL;
      return {
        message: { code: 200, text: '커플 위젯 조회가 완료되었습니다.' },
        widget: { photoUrl },
      };
    } catch (err) {
      console.error('커플 위젯 조회 중 에러 발생', err);
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(
        '커플 위젯 조회 중 오류가 발생했습니다',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 커플 위젯 설정
  async setCoupleWidget(
    userId: number,
    coupleId: number,
    file: Express.Multer.File,
  ) {
    try {
      const auth = await this.confirmCoupleAuth(userId, coupleId);
      if (!auth) {
        throw new HttpException('잘못된 접근입니다.', HttpStatus.BAD_REQUEST);
      }

      const photo = await this.s3.uploadImageToS3(file, 'widget');

      await this.prisma.widget.updateMany({
        where: { coupleId: coupleId },
        data: { photoUrl: photo.imageUrl },
      });

      return {
        message: { code: 200, text: '커플 위젯 설정이 완료되었습니다.' },
        widget: { photoUrl: photo.imageUrl },
      };
    } catch (err) {
      console.error('커플 위젯 설정 중 에러 발생', err);
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(
        '커플 위젯 설정 중 오류가 발생했습니다',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 커플 연결 해제
  async deleteCouple(userId: number, coupleId: number) {
    try {
      const auth = await this.confirmCoupleAuth(userId, coupleId);
      if (!auth) {
        throw new HttpException('잘못된 접근입니다.', HttpStatus.BAD_REQUEST);
      }

      await this.prisma.couple.delete({
        where: { id: coupleId },
      });

      return {
        message: { code: 200, text: '커플 연결 해제가 완료되었습니다.' },
      };
    } catch (err) {
      console.error('커플 삭제 중 에러 발생', err);
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(
        '커플 삭제 중 오류가 발생했습니다',
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

  // 커플 디데이 조회 (경과일)
  getDDay(anniversary: Date) {
    // 오늘 날짜 (한국시간)
    const today = new Date();
    return differenceInCalendarDays(today, anniversary);
  }

  // 남은 일수 계산
  getDays(date: Date) {
    const today = new Date();
    return differenceInCalendarDays(date, today);
  }

  // 다가오는 기념일 조회
  getUpcommingAnniv(dday: number, anniversary: Date) {
    const nextHundred = Math.ceil(dday / 100) * 100;
    const hundredDiff = nextHundred - dday;
    const nextHundredDate = addDays(anniversary, nextHundred);

    const nextYear = Math.ceil(dday / 365);
    const yearDiff = nextYear * 365 - dday;
    const nextYearDate = addYears(anniversary, nextYear);

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

    // 올해 생일 날짜 생성
    const nextBirthday = set(birthday, {
      year: today.getFullYear(),
    });

    // 오늘 이후가 아니면 내년 생일로
    const finalBirthday =
      nextBirthday < today ? addYears(nextBirthday, 1) : nextBirthday;

    const days = differenceInCalendarDays(finalBirthday, today);

    return {
      days,
      date: finalBirthday,
    };
  }
}
