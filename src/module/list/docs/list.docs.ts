import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export const getListDocs = {
  operation: ApiOperation({
    summary: '버킷리스트 조회',
    description: '커플의 버킷리스트의 아이템 목록을 조회합니다.',
  }),

  param1: ApiParam({
    name: 'coupleId',
    required: true,
    type: Number,
    description: '커플 id',
    example: 1,
  }),
  response: ApiResponse({
    status: 200,
    description: '리스트 조회 성공',
    schema: {
      type: 'object',
      example: {
        message: {
          code: '응답 코드(200) | number',
          text: '리스트 조회가 완료되었습니다. | string',
        },
        list: [
          {
            id: '아이템 id | number',
            isOwn: '본인이 작성한 리스트인지 여부 | boolean',
            categoryId: '카테고리 id | number',
            content: '리스트 내용 | string',
            createdAt: '생성일(ISO 문자열) | string',
            isDone: '완료 여부 | boolean',
          },
        ],
      },
    },
  }),
};

export const createListDocs = {
  operation: ApiOperation({
    summary: '버킷리스트 목록 등록',
    description: '커플의 특정 버킷리스트에 아이템을 등록합니다.',
  }),

  body: ApiBody({
    schema: {
      type: 'object',
      properties: {
        coupleId: { type: 'number', example: '커플 id | number' },
        categoryId: { type: 'number', example: '카테고리 id | number' },
        content: { type: 'string', example: '등록할 내용 | string' },
      },
      required: ['coupleId', 'listId', 'content'],
    },
  }),

  response: ApiResponse({
    status: 200,
    description: '리스트 목록 등록 성공',
    schema: {
      type: 'object',
      example: {
        message: {
          code: '응답 코드(200) | number',
          text: '리스트 목록이 작성되었습니다. | string',
        },
      },
    },
  }),
};

export const listDoneHandlerDocs = {
  operation: ApiOperation({
    summary: '버킷리스트 완료 여부 토글',
    description: '특정 버킷리스트 아이템의 완료 여부를 변경합니다.',
  }),

  param1: ApiParam({
    name: 'coupleId',
    type: 'number',
    description: '커플 id',
    example: '커플 id | number',
  }),

  param2: ApiParam({
    name: 'contentId',
    type: 'number',
    description: '완료 여부를 변경할 목록 id',
    example: '변경할 목록 id | number',
  }),

  response: ApiResponse({
    status: 200,
    description: '리스트 완료 여부 토글 성공',
    schema: {
      type: 'object',
      example: {
        message: {
          code: '응답 코드(200) | number',
          text: '리스트 완료 여부 설정이 완료되었습니다. | string',
        },
      },
    },
  }),
};

export const deleteListDocs = {
  operation: ApiOperation({
    summary: '리스트 목록 삭제',
    description: 'JWT 인증된 유저가 리스트 목록을 삭제합니다.',
  }),

  param1: ApiParam({
    name: 'coupleId',
    type: 'number',
    required: true,
    description: '커플 id | number',
    example: 1,
  }),
  param2: ApiParam({
    name: 'contentId',
    type: 'number',
    required: true,
    description: '리스트 content id | number',
    example: 3,
  }),

  response: ApiResponse({
    status: 200,
    description: '리스트 목록 삭제 성공',
    schema: {
      type: 'object',
      example: {
        message: {
          code: '응답 코드(200) | number',
          text: '리스트 목록이 삭제 삭제되었습니다. | string',
        },
      },
    },
  }),
};
