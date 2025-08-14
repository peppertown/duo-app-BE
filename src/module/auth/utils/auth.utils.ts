import { ConfigService } from 'src/config/config.service';

// 구글 OAuth 딥링킹 용 url 생성
export const buildGoogleOAuthUrl = (configService: ConfigService) => {
  const clientId = configService.googleClientId;
  const redirectUri = encodeURIComponent(configService.googleRedirectUri);
  const scope = encodeURIComponent('profile email');
  const state = configService.googleSecureState;

  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth` +
    `?client_id=${clientId}` +
    `&redirect_uri=${redirectUri}` +
    `&response_type=code` +
    `&scope=${scope}` +
    `&access_type=offline` +
    `&state=${state}` +
    `&prompt=select_account`;

  return authUrl;
};

// 로그인 응답데이터 포매팅
export function formatLoginResponse(user: any, couple: any, partner: any) {
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
