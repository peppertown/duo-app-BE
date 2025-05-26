import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly redis: RedisService,
  ) {}

  async register(data: {
    id: string;
    password: string;
    nickname: string;
    role: string;
  }) {
    const { id, password, nickname, role } = data;

    // 중복 확인
    const existingUser = await this.prisma.user.findUnique({
      where: { userId: id },
    });
    if (existingUser) {
      throw new BadRequestException('이미 존재하는 사용자 ID입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        userId: id,
        password: hashedPassword,
        nickname,
        role,
      },
    });

    return {
      message: '회원가입 성공',
      user: {
        id: newUser.id,
        userId: newUser.userId,
        nickname: newUser.nickname,
      },
    };
  }

  // 로그인
  async login(data: { id: string; password: string }) {
    const { id, password } = data;

    const user = await this.prisma.user.findUnique({
      where: { userId: id },
    });

    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('비밀번호가 올바르지 않습니다.');
    }

    const accessToken = await this.generateAccessToken(user.id);
    const refreshToken = await this.generateRefreshToken(user.id);

    await this.saveServerRefreshToken(user.id, refreshToken);

    return {
      success: true,
      message: {
        code: 200,
        text: '로그인이 완료됐습니다.',
      },
      user: {
        nickname: user.nickname,
        role: user.role,
      },
      jwt: {
        accessToken,
        refreshToken,
      },
    };
  }

  async generateAccessToken(userId: number): Promise<string> {
    try {
      return await this.jwt.signAsync(
        { userId },
        { expiresIn: '1h' }, // 액세스 토큰 1시간
      );
    } catch (err) {
      console.error('액세스 토큰 생성 실패:', err);
      throw new HttpException(
        '액세스 토큰 생성 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateRefreshToken(userId: number): Promise<string> {
    try {
      return this.jwt.signAsync(
        { userId },
        { expiresIn: '7d' }, // 리프레시 토큰 7일
      );
    } catch (err) {
      console.error('리프레시 토큰 생성 실패:', err);
      throw new HttpException(
        '리프레시 토큰 생성 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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
}
