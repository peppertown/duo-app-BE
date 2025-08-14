import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  addDays,
  addYears,
  differenceInCalendarDays,
  isBefore,
  set,
  startOfDay,
} from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { ImageUploader } from 'src/uploader/uploader.interface';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class CoupleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    @Inject('ImageUploader') private readonly uploader: ImageUploader,
  ) {}

  // 디데이용 기념일 설정
  async setAnniversary(userId: number, coupleId: number, anniversary: string) {
    const now = startOfDay(new Date());
    const annivDate = startOfDay(new Date(anniversary));
    if (isBefore(now, annivDate)) {
      throw new HttpException(
        '잘못된 날짜 설정입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const couple = await this.prisma.couple.update({
      where: { id: coupleId },
      data: { anniversary: new Date(anniversary) },
    });

    return {
      message: { code: 200, text: '기념일 설정이 완료되었습니다.' },
      couple: {
        anniversary: couple.anniversary,
      },
    };
  }

  // 커플 기념일 등록
  async addAnniversary(
    userId: number,
    coupleId: number,
    title: string,
    anniversary: Date,
  ) {
    const now = startOfDay(new Date());
    const annivDate = startOfDay(new Date(anniversary));
    if (isBefore(annivDate, now)) {
      throw new HttpException(
        '잘못된 날짜 설정입니다.',
        HttpStatus.BAD_REQUEST,
      );
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
  }

  // 커플 기념일 수정
  async updateAnniversary(
    userId: number,
    coupleId: number,
    annivId: number,
    title: string,
    anniversary: Date,
  ) {
    const now = startOfDay(new Date());
    const annivDate = startOfDay(new Date(anniversary));
    if (isBefore(annivDate, now)) {
      throw new HttpException(
        '잘못된 날짜 설정입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const anniv = await this.prisma.coupleAnniversary.update({
      where: { id: annivId },
      data: {
        title,
        date: new Date(anniversary),
      },
    });

    const days = this.getDays(anniv.date);

    return {
      message: { code: 200, text: '기념일 수정이 완료되었습니다.' },
      anniv: {
        id: anniv.id,
        title: anniv.title,
        date: anniv.date,
        days,
      },
    };
  }

  // 커플 기념일 삭제
  async deleteAnniversary(userId: number, coupleId: number, annivId: number) {
    await this.prisma.coupleAnniversary.delete({
      where: { id: annivId },
    });

    return {
      message: { code: 200, text: '기념일 삭제가 완료되었습니다.' },
    };
  }

  // 커플 위젯 조회
  async getCoupleWidget(userId: number, coupleId: number) {
    const widget = await this.prisma.widget.findFirst({
      where: {
        coupleId: coupleId,
      },
    });

    const photoUrl = widget.photoUrl
      ? widget.photoUrl
      : this.configService.defaultWidgetUrl;
    return {
      message: { code: 200, text: '커플 위젯 조회가 완료되었습니다.' },
      widget: { photoUrl },
    };
  }

  // 커플 위젯 설정
  async setCoupleWidget(
    userId: number,
    coupleId: number,
    file: Express.Multer.File,
  ) {
    const photo = await this.uploader.upload(file, 'widget');

    await this.prisma.widget.updateMany({
      where: { coupleId: coupleId },
      data: { photoUrl: photo.imageUrl },
    });

    return {
      message: { code: 200, text: '커플 위젯 설정이 완료되었습니다.' },
      widget: { photoUrl: photo.imageUrl },
    };
  }

  // 커플 연결 해제
  async deleteCouple(userId: number, coupleId: number) {
    await this.prisma.couple.delete({
      where: { id: coupleId },
    });

    return {
      message: { code: 200, text: '커플 연결 해제가 완료되었습니다.' },
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

  // 커플 기념일 조회
  async getCoupleAnniversaries(coupleId: number) {
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
      { id: 2, type: `${data.a.nickname}님 생일`, ...aBirth },
      { id: 3, type: `${data.b.nickname}님 생일`, ...bBirth },
    ];

    const otherAnniv = await this.prisma.coupleAnniversary.findMany({
      where: { coupleId },
      orderBy: { date: 'asc' },
    });

    if (otherAnniv.length) {
      otherAnniv.forEach((item) => {
        const days = this.getDays(item.date);
        anniv.push({
          id: item.id,
          type: item.title,
          days,
          date: item.date,
        });
      });
    }

    anniv.sort((a, b) => a.date.getTime() - b.date.getTime());

    return {
      message: { code: 200, text: '커플 기념일 조회가 완료되었습니다.' },
      anniv,
    };
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
        id: 1,
        type: `${nextHundred}일`,
        days: hundredDiff,
        date: nextHundredDate,
      };
    } else {
      return {
        id: 1,
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
