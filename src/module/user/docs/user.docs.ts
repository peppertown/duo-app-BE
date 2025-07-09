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

export const isMatchedDocs = {
  operation: ApiOperation({
    summary: '커플 매칭 상태 확인',
    description: '현재 로그인한 사용자의 커플 매칭 상태를 확인합니다.',
  }),
  response: ApiResponse({
    status: 200,
    description: '매칭된 경우 응답',
    schema: {
      type: 'object',
      example: {
        success: true,
        message: {
          code: '응답 코드 | number',
          text: '결과 메시지 | string',
        },
        user: {
          id: '유저 ID | number',
          email: '이메일 | string',
          nickname: '닉네임 | string',
          profileUrl: '프로필 이미지 URL | string',
          code: '매칭 코드 | string',
          coupleId: '커플 ID | number',
        },
        couple: {
          anniversary: '기념일 | string (ISO 8601)',
        },
        partner: {
          id: '상대 유저 ID | number',
          email: '상대 이메일 | string',
          nickname: '상대 닉네임 | string',
          profileUrl: '상대 프로필 이미지 URL | string',
          code: '상대 매칭 코드 | string',
        },
      },
    },
  }),
  response404: ApiResponse({
    status: 404,
    description: '매칭되지 않은 경우 응답',
    schema: {
      type: 'object',
      example: {
        success: false,
        message: {
          code: '404 | number',
          text: '커플이 연결되어 있지 않습니다. | string',
        },
      },
    },
  }),
};

export const setUserBirthdayDocs = {
  operation: ApiOperation({
    summary: '유저 생일 설정',
    description: 'JWT 인증된 유저가 자신의 생일을 등록/수정합니다.',
  }),

  body: ApiBody({
    schema: {
      type: 'object',
      properties: {
        birthday: { type: 'string', example: '생일(YYYY-MM-DD) | string' },
      },
      required: ['birthday'],
    },
  }),

  response: ApiResponse({
    status: 200,
    description: '유저 생일 설정 성공',
    schema: {
      type: 'object',
      example: {
        message: {
          code: '응답 코드(200) | number',
          text: '유저 생일 설정이 완료되었습니다. | string',
        },
        user: {
          birthday: '생일(YYYY-MM-DD) | string',
        },
      },
    },
  }),
};

export const deleteUserDocs = {
  operation: ApiOperation({
    summary: '회원 탈퇴',
    description: '현재 로그인한 사용자의 계정을 삭제합니다.',
  }),
  response: ApiResponse({
    status: 200,
    description: '회원 탈퇴 응답',
    schema: {
      type: 'object',
      example: {
        message: {
          code: '응답 코드 | number',
          text: '결과 메시지 | string',
        },
      },
    },
  }),
};

export const uploadProfileImageDocs = {
  operation: ApiOperation({
    summary: '유저 프로필 사진 변경',
    description: '로그인한 유저의 프로필 사진을 업로드합니다.',
  }),
  body: ApiBody({
    description: '업로드할 이미지 파일',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  }),
  response: ApiResponse({
    status: 200,
    description: '프로필 사진 업로드 완료 응답',
    schema: {
      type: 'object',
      example: {
        message: {
          code: '응답 코드 | number',
          text: '결과 메시지 | string',
        },
        user: {
          profileUrl: '업로드된 이미지 URL | string',
        },
      },
    },
  }),
};
