// 구글 OAuth 딥링킹 용 url 생성
export const buildGoogleOAuthUrl = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.GOOGLE_REDIRECT_URI);
  const scope = encodeURIComponent('profile email');
  const state = process.env.GOOGLE_SECURE_STATE;

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
