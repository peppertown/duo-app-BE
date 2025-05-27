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
import axios from 'axios';

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
      where: { email: id },
    });
    if (existingUser) {
      throw new BadRequestException('이미 존재하는 사용자 ID입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email: id,
        password: hashedPassword,
        nickname,
        role,
      },
    });

    return {
      message: '회원가입 성공',
      user: {
        id: newUser.id,
        email: newUser.email,
        nickname: newUser.nickname,
      },
    };
  }

  // 로그인
  async login(data: { id: string; password: string }) {
    const { id, password } = data;

    const user = await this.prisma.user.findUnique({
      where: { email: id },
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

  async googleLogin(code: string) {
    try {
      // 1. 구글 토큰 요청
      const decodedCode = decodeURIComponent(code);
      const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
          code: decodedCode,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.GOOGLE_REDIRECT_URI,
          grant_type: 'authorization_code',
        },
        { headers: { 'Content-Type': 'application/json' } },
      );

      const { id_token } = tokenResponse.data;

      // 2. id_token 디코딩 (검증 포함 가능)
      const decoded = this.jwt.decode(id_token) as {
        sub: string;
        email: string;
        name: string;
        picture: string;
      };

      if (!decoded?.sub) {
        throw new HttpException(
          'Invalid Google ID Token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // 3. 유저 회원가입/로그인 처리
      const { sub, email, name, picture } = decoded;

      let user = await this.prisma.user.findUnique({
        where: { sub },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            sub,
            email,
            nickname: name,
            profileUrl: picture,
            authProvider: 'Google',
          },
        });
      }

      // 4. JWT 발급 및 레디스 저장
      const accessToken = await this.generateAccessToken(user.id);
      const refreshToken = await this.generateRefreshToken(user.id);

      await this.saveServerRefreshToken(user.id, refreshToken);

      return {
        jwt: {
          accessToken,
          refreshToken,
        },
        user: {
          email,
          nickname: user.nickname,
          profileUrl: user.profileUrl,
        },
      };
    } catch (err) {
      console.error('❌ 구글 토큰 요청 실패:', err.response?.data || err);
    }
  }
}
