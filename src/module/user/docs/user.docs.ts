import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const setUserNicknameDocs = {
  operation: ApiOperation({
    summary: '유저 닉네임 설정',
    description: 'JWT 인증된 유저가 닉네임을 설정합니다.',
  }),

  body: ApiBody({
    schema: {
      type: 'object',
      properties: {
        nickname: {
          type: 'string',
          example: '사용자가 설정할 닉네임',
        },
      },
      required: ['nickname'],
    },
  }),

  response: ApiResponse({
    status: 200,
    description: '닉네임 설정 성공 시 응답',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'object',
          properties: {
            code: { type: 'number', example: 200 },
            text: { type: 'string', example: '닉네임 설정이 완료되었습니다' },
          },
        },
        user: {
          type: 'object',
          properties: {
            nickname: {
              type: 'string',
              example: '설정된 닉네임',
            },
          },
        },
      },
    },
  }),
};

export const setUserRoleDocs = {
  operation: ApiOperation({
    summary: '유저 역할(role) 설정',
    description: 'JWT 인증된 유저가 자신의 역할을 설정합니다.',
  }),

  body: ApiBody({
    schema: {
      type: 'object',
      properties: {
        role: {
          type: 'string',
          example: '사용자가 설정할 역할',
        },
      },
      required: ['role'],
    },
  }),

  response: ApiResponse({
    status: 200,
    description: '역할 설정 성공 시 응답',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'object',
          properties: {
            code: { type: 'number', example: 200 },
            text: { type: 'string', example: 'role 설정이 완료되었습니다.' },
          },
        },
        user: {
          type: 'object',
          properties: {
            role: {
              type: 'string',
              example: '설정된 역할',
            },
          },
        },
      },
    },
  }),
};

export const matchUserDocs = {
  operation: ApiOperation({
    summary: '커플 연결(매칭)',
    description: '코드(code)로 두 사용자를 커플로 연결합니다. (JWT 필요)',
  }),
  body: ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string', example: '상대방 코드' },
      },
      required: ['code'],
    },
  }),
  response: ApiResponse({
    status: 200,
    description: '커플 연결 성공',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'object',
          properties: {
            code: { type: 'number', example: '응답 코드(200)' },
            text: { type: 'string', example: '커플 연결이 완료되었습니다' },
          },
        },
        couple: {
          type: 'object',
          properties: {
            id: { type: 'number', example: '생성된 커플 id' },
          },
        },
      },
      example: {
        message: {
          code: '응답 코드(200)',
          text: '커플 연결이 완료되었습니다',
        },
        couple: {
          id: '생성된 커플 id | number',
        },
      },
    },
  }),
};
