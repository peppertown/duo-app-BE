import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CoupleRepository } from 'src/common/repositories/couple.repository';
import { NotificationService } from '../notification/notification.service';
import { AuthHelper } from './helper/auth.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly coupleRepository: CoupleRepository,
    private readonly notificationService: NotificationService,
    private readonly authHelper: AuthHelper,
  ) {}

  // 회원 가입
  async register(data: { email: string; password: string }) {
    const { email, password } = data;
    const newUser = await this.authHelper.createNewUser(email, password);

    const accessToken = await this.authHelper.generateAccessToken(newUser.id);
    const refreshToken = await this.authHelper.generateRefreshToken(newUser.id);

    await this.authHelper.saveServerRefreshToken(newUser.id, refreshToken);

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

    const user = await this.authHelper.validateUserLogin(email, password);
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

  // 구글 OAuth - 로그인 보안 코드 생성
  async generateGoogleLoginCode(code: string) {
    // id token 발급 및 디코딩
    const decoded = await this.authHelper.decodeGoogleIdToken(code);

    // 디코딩된 id token 데이터 파싱 및 로그인 코드 생성
    const securityCode = await this.authHelper.generateLoginCode(decoded);

    return securityCode;
  }

  // 구글 OAuth - 로그인 보안 코드 인증 후 유저 데이터 반환
  async verifyGoogleSecurityCode(securityCode: string) {
    const userData =
      await this.authHelper.vaildateGoogleLoginUser(securityCode);
    const { user, isNew } = await this.authHelper.findOrCreateAccount(userData);

    const response = await this.handleLoginProcess(user);

    return {
      message: {
        code: 200,
        text: '구글 로그인이 완료되었습니다.',
      },
      ...response,
      isNew,
    };
  }

  // 카카오 로그인
  async kakaoLogin(accessToken: string) {
    const userData = await this.authHelper.fetchKakoUserData(accessToken);
    const { user, isNew } = await this.authHelper.findOrCreateAccount(userData);

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

  // 토큰 재발급
  async handleRefresh(refreshToken: string) {
    const user = await this.authHelper.validateRefreshToken(refreshToken);

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
    const partner = await this.coupleRepository.findPartnerByUserAndCoupleId(userId, couple.id);

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
    const jwtAccessToken = await this.authHelper.generateAccessToken(user.id);
    const jwtRefreshToken = await this.authHelper.generateRefreshToken(user.id);

    // 리프레시 토큰 redis 저장
    await this.authHelper.saveServerRefreshToken(user.id, jwtRefreshToken);

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
