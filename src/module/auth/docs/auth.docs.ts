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
        code: { type: 'string', example: '기존 리프레시 토큰 | string' },
      },
    },
  }),

  response: ApiResponse({
    status: 200,
    description: '토큰 재발급 성공',
    schema: {
      type: 'object',
      example: {
        message: {
          code: '응답 코드 | number',
          text: '토큰 재발급이 완료되었습니다 | string',
        },
        jwt: {
          accessToken: 'jwt 액세스 토큰 | string',
          refreshToken: 'jwt 리프레시 토큰 | string',
        },
        user: {
          id: '유저 아이디 | number',
          email: '유저 이메일 | string',
          nickname: '닉네임 | string',
          profileUrl: '프로필 URL | string',
          code: '유저 코드 | string',
          coupleId: '커플 아이디 | number',
        },
        partner: {
          id: '상대방 아이디 | number',
          nickname: '상대방 닉네임 | string',
          profileUrl: '상대방 프로필 url | string',
          code: '상대방 코드 | string',
        },
        couple: {
          anniversary: '커플 기념일 | string',
          dday: '커플 D-Day | number',
        },
      },
    },
  }),
};

export const verifyGoogleSecurityCodeDocs = {
  operation: ApiOperation({
    summary: '구글 로그인 보안 코드 인증',
    description:
      '딥링크로 전달받은 securityCode를 검증해 로그인 처리를 완료합니다.',
  }),
  body: ApiBody({
    schema: {
      type: 'object',
      properties: {
        securityCode: { type: 'string', example: '구글 보안 코드 | string' },
      },
      required: ['securityCode'],
    },
  }),
  response: ApiResponse({
    status: 200,
    description: '구글 로그인 완료',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'object',
          properties: {
            code: { type: 'number', example: '응답 코드(200) | number' },
            text: {
              type: 'string',
              example: '구글 로그인이 완료되었습니다. | string',
            },
          },
        },
        jwt: {
          type: 'object',
          properties: {
            accessToken: { type: 'string', example: '액세스 토큰 | string' },
            refreshToken: { type: 'string', example: '리프레시 토큰 | string' },
          },
        },
        user: {
          type: 'object',
          properties: {
            email: { type: 'string', example: '유저 이메일 | string' },
            nickname: { type: 'string', example: '유저 닉네임 | string' },
            profileUrl: { type: 'string', example: '프로필 URL | string' },
            code: { type: 'string', example: '유저 코드 | string' },
            coupleId: { type: 'number', example: '커플 id | number' },
          },
        },
        isNew: { type: 'boolean', example: '신규 가입 여부 | boolean' },
      },
      example: {
        message: {
          code: '응답 코드(200) | number',
          text: '구글 로그인이 완료되었습니다. | string',
        },
        jwt: {
          accessToken: '액세스 토큰 | string',
          refreshToken: '리프레시 토큰 | string',
        },
        user: {
          id: '유저 아이디 | number',
          email: '유저 이메일 | string',
          nickname: '유저 닉네임 | string',
          profileUrl: '프로필 URL | string',
          code: '유저 코드 | string',
          coupleId: '커플 id | number',
        },
        parter: {
          id: '상대방 아이디 | number',
          nickname: '상대방 닉네임 | string',
          profileUlr: '상대방 프로필 url | string',
          code: '상대방 코드 | string',
        },
        couple: {
          anniversary: '커플 기념일 | string',
          dday: '커플 D-Day | number',
        },
        isNew: '신규 가입 여부 | boolean',
      },
    },
  }),
};

export const loginDocs = {
  operation: ApiOperation({
    summary: '자체 로그인',
    description: '이메일/비밀번호로 로그인합니다.',
  }),
  body: ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: '유저 이메일 | string' },
        password: { type: 'string', example: '비밀번호 | string' },
      },
      required: ['email', 'password'],
    },
  }),
  response: ApiResponse({
    status: 200,
    description: '로그인 성공',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: '로그인 성공 여부 | boolean' },
        message: {
          type: 'object',
          properties: {
            code: { type: 'number', example: '응답 코드(200) | number' },
            text: {
              type: 'string',
              example: '로그인이 완료됐습니다. | string',
            },
          },
        },
        user: {
          type: 'object',
          properties: {
            nickname: { type: 'string', example: '유저 닉네임 | string' },
            code: { type: 'string', example: '유저 코드 | string' },
            coupleId: { type: 'number', example: '커플 id | number' },
          },
        },
        jwt: {
          type: 'object',
          properties: {
            accessToken: { type: 'string', example: '액세스 토큰 | string' },
            refreshToken: { type: 'string', example: '리프레시 토큰 | string' },
          },
        },
      },
      example: {
        success: '로그인 성공 여부 | boolean',
        message: {
          code: '응답 코드(200) | number',
          text: '로그인이 완료됐습니다. | string',
        },
        user: {
          id: '유저 아이디 | number',
          email: '유저 이메일 | string',
          nickname: '닉네임 | string',
          profileUrl: '프로필 URL | string',
          code: '유저 코드 | string',
          coupleId: '커플 아이디 | number',
        },
        partner: {
          id: '상대방 아이디 | number',
          nickname: '상대방 닉네임 | string',
          profileUrl: '상대방 프로필 url | string',
          code: '상대방 코드 | string',
        },
        couple: {
          anniversary: '커플 기념일 | string',
          dday: '커플 D-Day | number',
        },
        jwt: {
          accessToken: '액세스 토큰 | string',
          refreshToken: '리프레시 토큰 | string',
        },
      },
    },
  }),
};

export const kakaoLoginDocs = {
  operation: ApiOperation({
    summary: '카카오 로그인',
    description: '카카오 accessToken으로 로그인 처리를 완료합니다.',
  }),

  body: ApiBody({
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', example: '카카오 accessToken | string' },
      },
      required: ['accessToken'],
    },
  }),

  response: ApiResponse({
    status: 200,
    description: '카카오 로그인 완료',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'object',
          properties: {
            code: { type: 'number', example: '응답 코드(200) | number' },
            text: {
              type: 'string',
              example: '카카오 로그인이 완료되었습니다. | string',
            },
          },
        },
        jwt: {
          type: 'object',
          properties: {
            accessToken: { type: 'string', example: '액세스 토큰 | string' },
            refreshToken: { type: 'string', example: '리프레시 토큰 | string' },
          },
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: '유저 아이디 | number' },
            email: { type: 'string', example: '유저 이메일 | string' },
            nickname: { type: 'string', example: '유저 닉네임 | string' },
            profileUrl: { type: 'string', example: '프로필 URL | string' },
            code: { type: 'string', example: '유저 코드 | string' },
            coupleId: { type: 'number', example: '커플 id | number' },
          },
        },
        partner: {
          type: 'object',
          properties: {
            id: { type: 'number', example: '상대방 아이디 | number' },
            nickname: { type: 'string', example: '상대방 닉네임 | string' },
            profileUrl: {
              type: 'string',
              example: '상대방 프로필 url | string',
            },
            code: { type: 'string', example: '상대방 코드 | string' },
          },
        },
        isNew: { type: 'boolean', example: '신규 가입 여부 | boolean' },
      },
      example: {
        message: {
          code: 200,
          text: '카카오 로그인이 완료되었습니다. | string',
        },
        jwt: {
          accessToken: '액세스 토큰 | string',
          refreshToken: '리프레시 토큰 | string',
        },
        user: {
          id: '유저 아이디 | number',
          email: '유저 이메일 | string',
          nickname: '닉네임 | string',
          profileUrl: '프로필 URL | string',
          code: '유저 코드 | string',
          coupleId: '커플 아이디 | number',
        },
        partner: {
          id: '상대방 아이디 | number',
          nickname: '상대방 닉네임 | string',
          profileUrl: '상대방 프로필 url | string',
          code: '상대방 코드 | string',
        },
        couple: {
          anniversary: '커플 기념일 | string',
          dday: '커플 D-Day | number',
        },
        isNew: '신규 가입 여부 | boolean',
      },
    },
  }),
};
