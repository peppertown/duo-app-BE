import {
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

export const getCoupleDataDocs = {
  operation: ApiOperation({
    summary: '커플 데이터 조회',
    description: '커플 ID를 받아 해당 커플의 정보를 조회합니다.',
  }),

  param: ApiParam({
    name: 'coupleId',
    required: true,
    description: '조회할 커플의 ID',
    example: 1,
  }),

  response: ApiOkResponse({
    description: '커플 데이터 응답 예시',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'object',
          properties: {
            code: { type: 'string', example: '응답 코드(200)' },
            text: {
              type: 'string',
              example: '커플 데이터 조회에 성공했습니다.',
            },
          },
        },
        couple: {
          type: 'object',
          properties: {
            id: { type: 'number', example: '커플 id | number' },
            name: { type: 'string', example: '커플명 | string' },
            anniversary: {
              type: 'string',
              example: '기념일(ISO 문자열, nullable)',
            },
          },
        },
      },
      example: {
        message: {
          code: '200',
          text: '커플 데이터 조회에 성공했습니다.',
        },
        couple: {
          id: '커플 id | number',
          name: '커플명 | string',
          anniversary: '기념일(ISO 문자열, nullable)',
        },
      },
    },
  }),
};

export const setAnniversaryDocs = {
  operation: ApiOperation({
    summary: '커플 기념일 설정',
    description: '커플의 기념일(anniversary)을 등록/수정합니다.',
  }),

  param: ApiParam({
    name: 'coupleId',
    required: true,
    description: '커플 ID',
    example: 1,
  }),

  body: ApiBody({
    schema: {
      type: 'object',
      properties: {
        anniversary: {
          type: 'string',
          example: '2025-08-15',
          description: '기념일(ISO 8601 형식)',
        },
      },
      required: ['anniversary'],
    },
  }),

  response: ApiOkResponse({
    description: '기념일 설정 성공 응답',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'object',
          properties: {
            code: { type: 'string', example: '응답 코드(200)' },
            text: { type: 'string', example: '기념일 설정이 완료되었습니다.' },
          },
        },
        couple: {
          type: 'object',
          properties: {
            id: { type: 'number', example: '커플 id | number' },
            name: { type: 'string', example: '커플명 | string' },
            anniversary: { type: 'string', example: '기념일(ISO 문자열)' },
          },
        },
      },
      example: {
        message: {
          code: '200',
          text: '기념일 설정이 완료되었습니다.',
        },
        couple: {
          id: '커플 id | number',
          name: '커플명 | string',
          anniversary: '기념일(ISO 문자열)',
        },
      },
    },
  }),
};

export const setCoupleNameDocs = {
  operation: ApiOperation({
    summary: '커플 이름 설정',
    description: '커플의 이름(name)을 등록/수정합니다.',
  }),

  param: ApiParam({
    name: 'coupleId',
    required: true,
    description: '커플 ID',
    example: 1,
  }),

  body: ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: '우리 커플',
          description: '커플명',
        },
      },
      required: ['name'],
    },
  }),

  response: ApiOkResponse({
    description: '커플 이름 설정 성공 응답',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'object',
          properties: {
            code: { type: 'string', example: '응답 코드(200)' },
            text: {
              type: 'string',
              example: '커플 이름 설정이 완료되었습니다.',
            },
          },
        },
        couple: {
          type: 'object',
          properties: {
            id: { type: 'number', example: '커플 id | number' },
            name: { type: 'string', example: '커플명 | string' },
            anniversary: { type: 'string', example: '기념일(ISO 문자열)' },
          },
        },
      },
      example: {
        message: {
          code: '200',
          text: '커플 이름 설정이 완료되었습니다.',
        },
        couple: {
          id: '커플 id | number',
          name: '커플명 | string',
          anniversary: '기념일(ISO 문자열)',
        },
      },
    },
  }),
};
