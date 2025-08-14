import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { AuthService } from '../auth/auth.service';
import { ImageUploader } from 'src/uploader/uploader.interface';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    @Inject('ImageUploader') private readonly uploader: ImageUploader,
  ) {}
  // 유저 닉네임 설정
  async setUserNickname(userId: number, nickname: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { nickname },
    });

    return {
      message: { code: 200, text: '닉네임 설정이 완료되었습니다' },
      user: { nickname },
    };
  }

  async setUserBirthDay(userId: number, birthday: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { birthday: new Date(birthday) },
    });

    return {
      message: {
        code: 200,
        text: '유저 생일 설정이 완료되었습니다.',
      },
      user: { birthday },
    };
  }

  // 커플 연결
  async matchUser(userId: number, code: string) {
    let partner: any, couple: any;
    await this.prisma.$transaction(async (tx) => {
      couple = await tx.couple.findFirst({
        where: {
          OR: [{ aId: userId }, { bId: userId }],
        },
      });

      if (couple) {
        throw new HttpException(
          '이미 커플이 연결되어 있습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      partner = await tx.user.findUnique({
        where: { code },
      });

      if (!partner || partner.id == userId) {
        throw new HttpException('잘못된 코드 입니다.', HttpStatus.BAD_REQUEST);
      }

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

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    return {
      message: {
        code: 200,
        text: '커플 연결이 완료되었습니다',
      },
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        profileUrl: user.profileUrl,
        code: user.code,
        coupleId: couple.id,
      },
      partner: {
        id: partner.id,
        nickname: partner.nickname,
        profileUrl: partner.profileUrl,
        code: partner.code,
      },
      couple: {
        anniversary: couple.anniversary,
      },
    };
  }

  // 커플 매칭 상태 확인
  async isMatched(userId: number) {
    const match = await this.prisma.couple.findFirst({
      where: {
        OR: [{ aId: userId }, { bId: userId }],
      },
    });
    if (!match) {
      return {
        success: false,
        message: { code: 404, text: '커플이 연결되어 있지 않습니다.' },
      };
    }

    const { couple, partner } = await this.authService.getUserData(userId);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    return {
      success: true,
      message: { code: 200, text: '커플 매칭 상태 확인이 완료되었습니다.' },
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        profileUrl: user.profileUrl,
        code: user.code,
        coupleId: couple.id,
      },
      couple: { anniversary: couple.anniversary },
      partner,
    };
  }

  // 회원 탈퇴
  async deleteUser(userId: number) {
    await this.prisma.user.delete({
      where: { id: userId },
    });
    await this.redis.del(`${this.configService.refreshKeyJwt}:${userId}`);
    return {
      message: {
        code: 200,
        text: '사용자 삭제가 완료되었습니다.',
      },
    };
  }

  // 프로필 사진 업로드
  async uploadProfileImage(userId: number, file: Express.Multer.File) {
    const result = await this.uploader.upload(file, 'profile');

    await this.prisma.user.update({
      where: { id: userId },
      data: { profileUrl: result.imageUrl },
    });

    return {
      message: { code: 200, text: '프로필 사진 업로드가 완료되었습니다.' },
      user: { profileUrl: result.imageUrl },
    };
  }
}
