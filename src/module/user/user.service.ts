import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { AuthService } from '../auth/auth.service';
import { ImageUploader } from 'src/uploader/uploader.interface';
import { ConfigService } from 'src/config/config.service';
import { UserRepository } from 'src/common/repositories/user.repository';
import { CoupleRepository } from 'src/common/repositories/couple.repository';
import { formatApiResponse } from 'src/common/utils/response.util';
import { formatMatchUserData, formatUserData } from './utils/user.util';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userRepository: UserRepository,
    private readonly coupleRepository: CoupleRepository,
    private readonly redis: RedisService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    @Inject('ImageUploader') private readonly uploader: ImageUploader,
  ) {}
  async setUserNickname(userId: number, nickname: string) {
    await this.userRepository.updateNickname(userId, nickname);

    return formatApiResponse(200, '닉네임 설정이 완료되었습니다', {
      user: { nickname },
    });
  }

  async setUserBirthDay(userId: number, birthday: string) {
    await this.userRepository.updateBirthday(userId, new Date(birthday));

    return formatApiResponse(200, '유저 생일 설정이 완료되었습니다.', {
      user: { birthday },
    });
  }

  async matchUser(userId: number, code: string) {
    const existingCouple = await this.coupleRepository.findByUserId(userId);
    if (existingCouple) {
      throw new HttpException(
        '이미 커플이 연결되어 있습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const partner = await this.userRepository.findByCode(code);
    if (!partner || partner.id === userId) {
      throw new HttpException('잘못된 코드 입니다.', HttpStatus.BAD_REQUEST);
    }

    let couple: any;
    await this.prisma.$transaction(async (tx) => {
      couple = await tx.couple.create({
        data: {
          aId: userId,
          bId: partner.id,
          anniversary: new Date(),
        },
      });

      await tx.list.create({
        data: { coupleId: couple.id },
      });

      await tx.widget.create({
        data: {
          coupleId: couple.id,
          photoUrl: this.configService.defaultWidgetUrl,
        },
      });
    });

    const user = await this.userRepository.findById(userId);

    return formatApiResponse(
      200,
      '커플 연결이 완료되었습니다',
      formatMatchUserData(user, partner, couple),
    );
  }

  async isMatched(userId: number) {
    const match = await this.coupleRepository.findByUserId(userId);
    if (!match) {
      return {
        success: false,
        message: { code: 404, text: '커플이 연결되어 있지 않습니다.' },
      };
    }

    const { couple, partner } = await this.authService.getUserData(userId);
    const user = await this.userRepository.findById(userId);

    return {
      success: true,
      message: { code: 200, text: '커플 매칭 상태 확인이 완료되었습니다.' },
      user: formatUserData(user, couple.id),
      couple: { anniversary: couple.anniversary },
      partner,
    };
  }

  async deleteUser(userId: number) {
    await this.userRepository.delete(userId);
    await this.redis.del(`${this.configService.refreshKeyJwt}:${userId}`);

    return formatApiResponse(200, '사용자 삭제가 완료되었습니다.');
  }

  async uploadProfileImage(userId: number, file: Express.Multer.File) {
    const result = await this.uploader.upload(file, 'profile');
    await this.userRepository.updateProfileUrl(userId, result.imageUrl);

    return formatApiResponse(200, '프로필 사진 업로드가 완료되었습니다.', {
      user: { profileUrl: result.imageUrl },
    });
  }
}
