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
