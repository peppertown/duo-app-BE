import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { S3Service } from 'src/s3/s3.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
    private readonly redis: RedisService,
    private readonly authService: AuthService,
  ) {}
  // 유저 닉네임 설정
  async setUserNickname(userId: number, nickname: string) {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { nickname },
      });

      return {
        message: { code: 200, text: '닉네임 설정이 완료되었습니다' },
        user: { nickname },
      };
    } catch (err) {
      console.error('닉네임 설정 중 에러 발생', err);
      throw new HttpException(
        '닉네임 설정 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async setUserBirthDay(userId: number, birthday: string) {
    try {
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
    } catch (err) {
      console.error('유저 생일 설정 중 에러 발생', err);
      throw new HttpException(
        '유저 생일 설정 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 커플 연결
  async matchUser(userId: number, code: string) {
    let couple = await this.prisma.couple.findFirst({
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

    let partner: any;
    try {
      await this.prisma.$transaction(async (tx) => {
        partner = await tx.user.findUnique({
          where: { code },
        });

        if (!partner || partner.id == userId) {
          throw new HttpException(
            '잘못된 코드 입니다.',
            HttpStatus.BAD_REQUEST,
          );
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
            photoUrl: process.env.DEFAULT_WIDGET_URL,
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
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      console.error('커플 연결 중 에러 발생', err);
      throw new HttpException(
        '커플 연결 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 커플 매칭 상태 확인
  async isMatched(userId: number) {
    try {
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

      return {
        message: { code: 200, text: '커플 매칭 상태 확인이 완료되었습니다.' },
        isMatched: true,
      };
    } catch (err) {
      console.error('커플 매칭 상태 확인 중 에러 발생', err);
      throw new HttpException(
        '커플 매칭 상태 확인 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 회원 탈퇴
  async deleteUser(userId: number) {
    try {
      await this.prisma.user.delete({
        where: { id: userId },
      });
      await this.redis.del(`${process.env.REFRESH_KEY_JWT}:${userId}`);
      return {
        message: {
          code: 200,
          text: '사용자 삭제가 완료되었습니다.',
        },
      };
    } catch (err) {
      console.error('사용자 삭제 중 에러 발생', err);
      throw new HttpException(
        '사용자 삭제 중 오류가 발생했습니다',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 프로필 사진 업로드
  async uploadProfileImage(userId: number, file: Express.Multer.File) {
    try {
      const result = await this.s3.uploadImageToS3(file, 'profile');

      await this.prisma.user.update({
        where: { id: userId },
        data: { profileUrl: result.imageUrl },
      });

      return {
        message: { code: 200, text: '프로필 사진 업로드가 완료되었습니다.' },
        user: { profileUrl: result.imageUrl },
      };
    } catch (err) {
      console.error('프로필 사진 업로드 중 에러 발생', err);
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(
        '프로필 사진 업로드 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
