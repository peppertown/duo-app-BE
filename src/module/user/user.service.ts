import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
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

  // 커플 연결
  async matchUser(userId: number, code: string) {
    try {
      const partner = await this.prisma.user.findUnique({
        where: { code },
      });

      if (!partner || partner.id == userId) {
        throw new HttpException('잘못된 코드 입니다.', HttpStatus.BAD_REQUEST);
      }

      const couple = await this.prisma.couple.create({
        data: {
          aId: userId,
          bId: partner.id,
        },
      });

      return {
        message: {
          code: 200,
          text: '커플 연결이 완료되었습니다',
        },
        couple: {
          id: couple.id,
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

  // 유저 롤 설정
  // async setUserRole(userId: number, userRoleDto: UserRoleDto) {
  //   try {
  //     await this.prisma.user.update({
  //       where: { id: userId },
  //       data: { role: userRoleDto.role },
  //     });

  //     return {
  //       message: {
  //         code: 200,
  //         text: 'role 설정이 완료되었습니다.',
  //       },
  //       user: { role: userRoleDto.role },
  //     };
  //   } catch (err) {
  //     console.error('롤 설정 중 에러 발생', err);
  //     throw new HttpException(
  //       '롤 설정 중 오류가 발생했습니다.',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
}
