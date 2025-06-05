import { ApiOperation, ApiBody, ApiResponse, ApiQuery } from '@nestjs/swagger';

export const createScheduleDocs = {
  operation: ApiOperation({
    summary: '캘린더 일정 등록',
    description: 'JWT 인증된 유저가 커플 캘린더에 일정을 등록합니다.',
  }),

  body: ApiBody({
    schema: {
      type: 'object',
      properties: {
        coupleId: { type: 'number', example: '커플 id | number' },
        title: { type: 'string', example: '일정 제목 | string' },
        start: {
          type: 'string',
          example: '일정 시작 (ex. 2025-06-05T10:00) | string',
        },
        end: { type: 'string', example: '일정 종료  | string' },
      },
      required: ['coupleId', 'title', 'start', 'end'],
    },
  }),

  response: ApiResponse({
    status: 200,
    description: '일정 등록 성공',
    schema: {
      type: 'object',
      example: {
        message: {
          code: '응답 코드(200)',
          text: '캘린더 일정 등록이 완료되었습니다.',
        },
        schedule: {
          userId: '등록자 id | number',
          title: '일정 제목 | string',
          start: '일정 시작 (ISO 문자열)',
          end: '일정 종료 (ISO 문자열)',
        },
      },
    },
  }),
};

export const getMonthlyScheduleDocs = {
  operation: ApiOperation({
    summary: '월별 캘린더 조회',
    description: '해당 월의 일정(스케줄) 목록을 조회합니다.',
  }),
  query1: ApiQuery({
    name: 'coupleId',
    required: false,
    description: '커플 id | number',
    example: 1,
    type: Number,
  }),
  query2: ApiQuery({
    name: 'year',
    required: true,
    description: '조회 연도 | number',
    example: 2025,
    type: Number,
  }),
  query3: ApiQuery({
    name: 'month',
    required: true,
    description: '조회 월 | number',
    example: 6,
    type: Number,
  }),
  response: ApiResponse({
    status: 200,
    description: '캘린더 월별 일정 목록',
    schema: {
      type: 'object',
      example: {
        message: {
          code: '응답 코드(200)',
          text: '캘린더 조회가 완료되었습니다',
        },
        schedule: [
          {
            userId: '유저 id | number',
            title: '일정 제목 | string',
            start: '시작일(ISO 문자열)',
            end: '종료일(ISO 문자열)',
          },
        ],
      },
    },
  }),
};
