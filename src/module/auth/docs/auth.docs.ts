import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const googleCallbackDocs = {
  operation: ApiOperation({
    summary: '구글 로그인 콜백 API',
    description:
      '프론트에서 전달된 code를 통해 구글 OAuth 인증을 처리하고 JWT를 반환합니다.',
  }),

  body: ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string', example: '구글 Authorization Code' },
      },
    },
  }),

  response: ApiResponse({
    status: 200,
    description: '구글 로그인 성공 시 JWT 및 유저 정보 반환',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'object',
          properties: {
            code: { type: 'number', example: 200 },
            text: { type: 'string', example: '구글 로그인이 완료되었습니다.' },
          },
        },
        jwt: {
          type: 'object',
          properties: {
            accessToken: { type: 'string', example: 'jwt 액세스 토큰' },
            refreshToken: { type: 'string', example: 'jwt 리프레시 토큰' },
          },
        },
        user: {
          type: 'object',
          properties: {
            email: { type: 'string', example: '사용자 이메일' },
            nickname: { type: 'string', example: '닉네임' },
            profileUrl: {
              type: 'string',
              example: '프로필 사진 url',
            },
          },
        },
      },
    },
  }),
};

export const handleRefreshDocs = {
  operation: ApiOperation({
    summary: '액세스 토큰 재발급 API',
    description: '만료된 액세스 토큰을 리프레시 토큰을 사용해 재발급합니다.',
  }),

  body: ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string', example: '기존 리프레시 토큰' },
      },
    },
  }),

  response: ApiResponse({
    status: 200,
    description: '토큰 재발급 성공',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'object',
          properties: {
            code: { type: 'number', example: 200 },
            text: {
              type: 'string',
              example: '토큰 재발급이 완료되었습니다',
            },
          },
        },
        jwt: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              example: 'jwt 액세스 토큰',
            },
            refreshToken: {
              type: 'string',
              example: 'jwt 리프레시 토큰',
            },
          },
        },
      },
    },
  }),
};
