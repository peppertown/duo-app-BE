import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

export const getMemoDocs = {
  operation: ApiOperation({
    summary: '메모 조회',
    description: '커플 메모를 조회합니다.',
  }),

  param1: ApiParam({
    name: 'coupleId',
    required: true,
    description: '커플 id',
    example: 1,
  }),

  response: ApiResponse({
    status: 200,
    description: '메모 조회 성공',
    schema: {
      type: 'object',
      example: {
        message: {
          code: '응답 코드(200) | number',
          text: '메모 조회가 완료되었습니다. | string',
        },
        memo: [
          {
            id: '메모 content id | number',
            isOwn: '본인이 작성한 메모인지 여부 | boolean',
            content: '메모 내용 | string',
            createdAt: '생성일(ISO 문자열)',
          },
        ],
      },
    },
  }),
};

export const createMemoDocs = {
  operation: ApiOperation({
    summary: '메모 등록',
    description: '유저가 커플의 메모를 작성합니다.',
  }),

  body: ApiBody({
    schema: {
      type: 'object',
      properties: {
        coupleId: { type: 'number', example: '커플 id | number' },
        content: { type: 'string', example: '메모 내용 | string' },
      },
      required: ['coupleId', 'content'],
    },
  }),

  response: ApiResponse({
    status: 200,
    description: '메모 등록 성공',
    schema: {
      type: 'object',
      example: {
        message: {
          code: '응답 코드(200) | number',
          text: '메모가 작성되었습니다. | string',
        },
      },
    },
  }),
};
