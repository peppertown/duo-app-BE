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
import { generateRandomString } from 'src/common/utils/random.util';
import { getPartnerData } from 'src/common/utils/couple.util';
import * as jwt from 'jsonwebtoken';
import { CoupleService } from '../couple/couple.service';
import { NotificationService } from '../notification/notification.service';
import { AuthHelper } from './helper/auth.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly redis: RedisService,
    private readonly coupleService: CoupleService,
    private readonly notificationService: NotificationService,
    private readonly authHelper: AuthHelper,
  ) {}

  private verifyRefreshToken(token: string): any {
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

  // 회원 가입
  async register(data: { email: string; password: string }) {
    const { email, password } = data;
    const newUser = await this.authHelper.createNewUser(email, password);

    const accessToken = await this.generateAccessToken(newUser.id);
    const refreshToken = await this.generateRefreshToken(newUser.id);

    await this.saveServerRefreshToken(newUser.id, refreshToken);

    return {
      message: '회원가입 성공',
      user: {
        id: newUser.id,
        email: newUser.email,
        nickname: newUser.nickname,
        code: newUser.code,
      },
      jwt: {
        accessToken,
        refreshToken,
      },
    };
  }

  // 로그인
  async login(data: { email: string; password: string }) {
    const { email, password } = data;

    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('비밀번호가 올바르지 않습니다.');
    }

    const response = await this.handleLoginProcess(user);

    return {
      success: true,
      message: {
        code: 200,
        text: '로그인이 완료됐습니다.',
      },
      ...response,
    };
  }

  // 액세스 토큰 발급
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

  // 리프레시 토큰 발급
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

  // 구글 로그인 후 보안 코드 생성
  async generateGoogleLoginCode(code: string) {
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
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
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
          '유효하지 않은 Google ID Token 입니다.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // 3. 유저 데이터 추출 및 보안 코드 생성
      const { sub, email, name, picture } = decoded;
      const userData = { sub, email, nickname: name, profileUrl: picture };
      const securityCode = generateRandomString();

      // 4. 보안 코드와 유저 데이터 레디스에 저장
      await this.redis.set(securityCode, JSON.stringify(userData), 300);

      return securityCode;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      console.error('구글 로그인 보안 코드 생성 중 에러 발생', err);
      throw new HttpException(
        '구글 로그인 보안 코드 생성 중 오류가 발생했습니다',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 구글 보안 코드 인증 후 유저 데이터 반환
  async verifyGoogleSecurityCode(securityCode: string) {
    try {
      // redis에서 보안 코드와 일치하는 값 확인
      const data = await this.redis.get(securityCode);

      if (!data) {
        throw new HttpException(
          '유효하지 않은 구글 보안 코드 입니다.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // 유저 데이터 확인 후 redis에서 제거
      await this.redis.del(securityCode);

      // 유저 데이터 파싱 후 DB 저장
      const userData = { ...JSON.parse(data), authProvider: 'Google' };
      const { user, isNew } = await this.findOrCreateAccount(userData);

      const response = await this.handleLoginProcess(user);

      return {
        message: {
          code: 200,
          text: '구글 로그인이 완료되었습니다.',
        },
        ...response,
        isNew,
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      console.error('구글 보안 코드 인증 중 에러 발생', err);
      throw new HttpException(
        '구글 보안 코드 인증 중 오류가 발생했습니다',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 카카오 로그인
  async kakaoLogin(accessToken: string) {
    const userRes = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const kakaoData = userRes.data;

    const { id } = kakaoData;
    const { nickname, profile_image, email } = kakaoData.properties;

    const { user, isNew } = await this.findOrCreateAccount({
      sub: id.toString(),
      email,
      nickname,
      profileUrl: profile_image,
      authProvider: 'Kakao',
    });

    const response = await this.handleLoginProcess(user);

    return {
      message: {
        code: 200,
        text: '카카오 로그인에 성공했습니다.',
      },
      ...response,
      isNew,
    };
  }

  // 계정 조회 or 생성
  async findOrCreateAccount(data: {
    sub: string;
    email: string;
    nickname: string;
    profileUrl: string;
    authProvider: string;
  }) {
    try {
      const { sub } = data;

      let isNew: boolean = false;

      let user = await this.prisma.user.findUnique({
        where: { sub },
      });

      if (!user) {
        const randomCode = generateRandomString();
        user = await this.prisma.user.create({
          data: {
            ...data,
            profileUrl: process.env.DEFAULT_PROFILE_URL,
            code: randomCode,
          },
        });
        isNew = true;
      }

      return { user, isNew };
    } catch (err) {
      console.error('계정 조회 및 생성 중 에러 발생', err);
      throw new HttpException(
        '계정 조회 및 생성 중 오류가 발생했습니다',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 토큰 재발급
  async handleRefresh(refreshToken: string) {
    const decoded = this.verifyRefreshToken(refreshToken);
    const user = { id: decoded.userId };

    const originRefreshToken = await this.redis.get(
      `${process.env.REFRESH_KEY_JWT}:${user.id}`,
    );

    if (originRefreshToken !== refreshToken) {
      throw new HttpException(
        '잘못된 리프레시 토큰입니다',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const response = await this.handleLoginProcess(user);

    return {
      message: {
        code: 200,
        text: '토큰 재발급이 완료되었습니다',
      },
      ...response,
    };
  }

  // 사용자 데이터 조회
  async getUserData(userId: number) {
    const couple = await this.prisma.couple.findFirst({
      where: {
        OR: [{ aId: userId }, { bId: userId }],
      },
    });
    if (!couple) {
      return {
        couple: null,
        partner: null,
      };
    }
    const partner = await getPartnerData(userId, couple.id);

    return { couple, partner };
  }

  formatLoginResponse(user: any, couple: any, partner: any) {
    return {
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        profileUrl: user.profileUrl,
        code: user.code,
        coupleId: couple ? couple.id : null,
        birthday: user.birthday,
      },
      partner,
      couple: {
        anniversary: couple ? couple.anniversary : null,
      },
    };
  }

  async handleLoginProcess(user: any) {
    // 토큰 발급
    const jwtAccessToken = await this.generateAccessToken(user.id);
    const jwtRefreshToken = await this.generateRefreshToken(user.id);

    // 리프레시 토큰 redis 저장
    await this.saveServerRefreshToken(user.id, jwtRefreshToken);

    const { couple, partner } = await this.getUserData(user.id);
    const formatResponse = this.formatLoginResponse(user, couple, partner);

    const unreadNotification =
      await this.notificationService.unreadNotification(user.id);

    return {
      ...formatResponse,
      jwt: { accessToken: jwtAccessToken, refreshToken: jwtRefreshToken },
      unreadNotification,
    };
  }
}
