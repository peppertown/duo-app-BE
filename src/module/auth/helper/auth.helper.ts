import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { generateRandomString } from 'src/common/utils/random.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthHelper {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly redis: RedisService,
  ) {}

  // 리프레쉬 토큰 검증
  verifyRefreshToken(token: string): any {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      return decoded;
    } catch (error) {
      console.error('리프레시 토큰 검증 실패:', error.message);
      throw new HttpException(
        '유효하지 않은 리프레시 토큰입니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  // 액세스 토큰 발급
  async generateAccessToken(userId: number): Promise<string> {
    try {
      return await this.jwt.signAsync({ userId }, { expiresIn: '1h' });
    } catch (err) {
      console.error('액세스 토큰 생성 실패:', err);
      throw new HttpException(
        '액세스 토큰 생성 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 리프레시 토큰 발급
  async generateRefreshToken(userId: number): Promise<string> {
    try {
      return this.jwt.signAsync({ userId }, { expiresIn: '7d' });
    } catch (err) {
      console.error('리프레시 토큰 생성 실패:', err);
      throw new HttpException(
        '리프레시 토큰 생성 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 리프레시 토큰 저장
  async saveServerRefreshToken(userId: number, refreshToken: string) {
    try {
      const key = `${process.env.REFRESH_KEY_JWT}:${userId}`;
      const ttlSeconds = 7 * 24 * 60 * 60; // 7일
      await this.redis.set(key, refreshToken, ttlSeconds);
    } catch (err) {
      console.error('JWT 리프레시 토큰 레디스 저장 실패', err);
      throw new HttpException(
        'JWT 리프레시 토큰 레디스 저장 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 회원가입 헬퍼 - 입력된 email password 기반으로 새로운 유저 데이터 생성
  async createNewUser(email: string, password: string) {
    const nickname = email.split('@')[0];

    // 중복 확인
    const existingUser = await this.prisma.user.findFirst({
      where: { email },
    });
    if (existingUser) {
      throw new HttpException(
        '이미 존재하는 사용자 ID입니다.',
        HttpStatus.ACCEPTED,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const randomCode = generateRandomString();
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname,
        code: randomCode,
        profileUrl: process.env.DEFAULT_PROFILE_URL,
      },
    });

    return newUser;
  }

  // 자체 로그인 헬퍼 - 로그인 데이터 vaild 한지 확인 후 DB에 저장된 user 값 리턴
  async validateUserLogin(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new HttpException(
        '존재하지 않는 사용자입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpException(
        '비밀번호가 올바르지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
