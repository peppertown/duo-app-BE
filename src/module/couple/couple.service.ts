import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { isBefore, startOfDay } from 'date-fns';
import { ImageUploader } from 'src/uploader/uploader.interface';
import { ConfigService } from 'src/config/config.service';
import { CoupleRepository } from 'src/common/repositories/couple.repository';
import {
  getDDay,
  getDays,
  getUpcomingAnniversary,
  getDaysToNextBirthday,
} from 'src/common/utils/date.util';
import { formatApiResponse } from 'src/common/utils/response.util';

@Injectable()
export class CoupleService {
  constructor(
    private readonly coupleRepository: CoupleRepository,
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

    const couple = await this.coupleRepository.update(coupleId, {
      anniversary: new Date(anniversary),
    });

    return formatApiResponse(200, '기념일 설정이 완료되었습니다.', {
      couple: {
        anniversary: couple.anniversary,
      },
    });
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

    const anniv = await this.coupleRepository.createAnniversary({
      title,
      coupleId,
      date: new Date(anniversary),
    });

    const days = getDays(anniv.date);

    return formatApiResponse(200, '기념일 등록이 완료되었습니다.', {
      anniv: {
        id: anniv.id,
        title: anniv.title,
        date: anniv.date,
        days,
      },
    });
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

    const anniv = await this.coupleRepository.updateAnniversary(annivId, {
      title,
      date: new Date(anniversary),
    });

    const days = getDays(anniv.date);

    return formatApiResponse(200, '기념일 수정이 완료되었습니다.', {
      anniv: {
        id: anniv.id,
        title: anniv.title,
        date: anniv.date,
        days,
      },
    });
  }

  // 커플 기념일 삭제
  async deleteAnniversary(userId: number, coupleId: number, annivId: number) {
    await this.coupleRepository.deleteAnniversary(annivId);

    return formatApiResponse(200, '기념일 삭제가 완료되었습니다.');
  }

  // 커플 위젯 조회
  async getCoupleWidget(userId: number, coupleId: number) {
    const widget = await this.coupleRepository.findWidgetByCoupleId(coupleId);

    const photoUrl = widget.photoUrl
      ? widget.photoUrl
      : this.configService.defaultWidgetUrl;
    return formatApiResponse(200, '커플 위젯 조회가 완료되었습니다.', {
      widget: { photoUrl },
    });
  }

  // 커플 위젯 설정
  async setCoupleWidget(
    userId: number,
    coupleId: number,
    file: Express.Multer.File,
  ) {
    const photo = await this.uploader.upload(file, 'widget');

    await this.coupleRepository.updateWidgetByCoupleId(coupleId, {
      photoUrl: photo.imageUrl,
    });

    return formatApiResponse(200, '커플 위젯 설정이 완료되었습니다.', {
      widget: { photoUrl: photo.imageUrl },
    });
  }

  // 커플 연결 해제
  async deleteCouple(userId: number, coupleId: number) {
    await this.coupleRepository.delete(coupleId);

    return formatApiResponse(200, '커플 연결 해제가 완료되었습니다.');
  }

  // 커플 관련 api 권한 확인
  async confirmCoupleAuth(userId: number, coupleId: number) {
    const coupleIds = await this.coupleRepository.findById(coupleId);

    const isValid = coupleIds.aId == userId || coupleIds.bId == userId;
    return isValid;
  }

  // 커플 기념일 조회
  async getCoupleAnniversaries(coupleId: number) {
    const data = await this.coupleRepository.findByIdWithUsers(coupleId);
    const dday = getDDay(data.anniversary);

    const upcoming = getUpcomingAnniversary(dday, data.anniversary);
    const aBirth = getDaysToNextBirthday(data.a.birthday);
    const bBirth = getDaysToNextBirthday(data.b.birthday);
    const anniv = [
      upcoming,
      { id: 2, type: `${data.a.nickname}님 생일`, ...aBirth },
      { id: 3, type: `${data.b.nickname}님 생일`, ...bBirth },
    ];

    const otherAnniv =
      await this.coupleRepository.findAnniversariesByCoupleId(coupleId);

    if (otherAnniv.length) {
      otherAnniv.forEach((item) => {
        const days = getDays(item.date);
        anniv.push({
          id: item.id,
          type: item.title,
          days,
          date: item.date,
        });
      });
    }

    anniv.sort((a, b) => a.date.getTime() - b.date.getTime());

    return formatApiResponse(200, '커플 기념일 조회가 완료되었습니다.', {
      anniv,
    });
  }
}
