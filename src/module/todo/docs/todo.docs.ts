import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

export const createTodoDocs = {
  operation: ApiOperation({
    summary: '투두 등록',
    description: '커플 투두를 작성합니다. (JWT 필요)',
  }),
  body: ApiBody({
    schema: {
      type: 'object',
      properties: {
        coupleId: { type: 'number', example: '커플 id' },
        content: { type: 'string', example: '투두 내용' },
      },
      required: ['coupleId', 'content'],
    },
  }),
  response: ApiResponse({
    status: 200,
    description: '투두 등록 성공',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'object',
          properties: {
            code: { type: 'number', example: '응답 코드(200)' },
            text: { type: 'string', example: '투두 등록이 완료되었습니다' },
          },
        },
        todo: {
          type: 'object',
          properties: {
            id: { type: 'number', example: '생성된 투두 id' },
            coupleId: { type: 'number', example: '커플 id' },
            writerId: { type: 'number', example: '작성자 id' },
            content: { type: 'string', example: '투두 내용' },
            isDone: { type: 'boolean', example: '투두 완료 여부' },
            createdAt: { type: 'string', example: '생성일(ISO 문자열)' },
          },
        },
      },
      example: {
        message: {
          code: '응답 코드(200)',
          text: '투두 등록이 완료되었습니다',
        },
        todo: {
          id: '생성된 투두 id | number',
          coupleId: '커플 id | number',
          writerId: '작성자 id | number',
          content: '투두 내용 | string',
          isDone: '투두 완료 여부 | boolean',
          createdAt: '생성일(ISO 문자열)',
        },
      },
    },
  }),
};

export const getTodosDocs = {
  operation: ApiOperation({
    summary: '커플 투두 전체 조회',
    description: '커플에 소속된 두 사용자의 모든 투두를 사용자별로 조회합니다.',
  }),
  query: ApiQuery({
    name: 'coupleId',
    required: true,
    description: '커플 id | number',
    example: 1,
  }),
  response: ApiResponse({
    status: 200,
    description: '투두 전체 조회 성공',
    schema: {
      type: 'object',
      properties: {
        todosByUser: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            properties: {
              nickname: { type: 'string', example: '유저 닉네임 | string' },
              todos: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', example: '투두 id | number' },
                    coupleId: { type: 'number', example: '커플 id | number' },
                    writerId: { type: 'number', example: '작성자 id | number' },
                    content: { type: 'string', example: '투두 내용 | string' },
                    isDone: {
                      type: 'boolean',
                      example: '투두 완료 여부 | boolean',
                    },
                    createdAt: {
                      type: 'string',
                      example: '생성일(ISO 문자열) | string',
                    },
                  },
                },
              },
            },
          },
        },
      },
      example: {
        todosByUser: {
          '유저 아이디1': {
            nickname: '유저1 닉네임 | string',
            todos: [
              {
                id: '투두 id | number',
                coupleId: '커플 id | number',
                writerId: '작성자 id | number',
                content: '투두 내용 | string',
                isDone: '투두 완료 여부 | boolean',
                createdAt: '생성일(ISO 문자열)',
              },
              // ...
            ],
          },
          '유저 아이디2': {
            nickname: '유저2 닉네임 | string',
            todos: [
              {
                id: '투두 id | number',
                coupleId: '커플 id | number',
                writerId: '작성자 id | number',
                content: '투두 내용 | string',
                isDone: '투두 완료 여부 | boolean',
                createdAt: '생성일(ISO 문자열)',
              },
            ],
          },
        },
      },
    },
  }),
};

export const todoDoneHandlerDocs = {
  operation: ApiOperation({
    summary: '투두 완료 상태 변경',
    description: '투두의 완료 여부를 토글(변경)합니다. (JWT 필요)',
  }),
  param: ApiParam({
    name: 'todoId',
    required: true,
    description: '투두 id | number',
    example: 7,
  }),
  response: ApiResponse({
    status: 200,
    description: '투두 완료 상태 변경 성공',
    schema: {
      type: 'object',
      properties: {
        messsage: {
          type: 'object',
          properties: {
            code: { type: 'number', example: '응답 코드(200) | number' },
            text: {
              type: 'string',
              example: '투두 완료 상태가 변경되었습니다. | string',
            },
          },
        },
        todo: {
          type: 'object',
          properties: {
            id: { type: 'number', example: '투두 id | number' },
            coupleId: { type: 'number', example: '커플 id | number' },
            writerId: { type: 'number', example: '작성자 id | number' },
            content: { type: 'string', example: '투두 내용 | string' },
            isDone: { type: 'boolean', example: '투두 완료 여부 | boolean' },
            createdAt: {
              type: 'string',
              example: '생성일(ISO 문자열) | string',
            },
          },
        },
      },
      example: {
        messsage: {
          code: '응답 코드(200) | number',
          text: '투두 완료 상태가 변경되었습니다. | string',
        },
        todo: {
          id: '투두 id | number',
          coupleId: '커플 id | number',
          writerId: '작성자 id | number',
          content: '투두 내용 | string',
          isDone: '투두 완료 여부 | boolean',
          createdAt: '생성일(ISO 문자열) | string',
        },
      },
    },
  }),
};

export const deleteTodoDocs = {
  operation: ApiOperation({
    summary: '투두 삭제',
    description: '투두를 삭제합니다. (JWT 필요)',
  }),
  param: ApiParam({
    name: 'todoId',
    required: true,
    description: '투두 id | number',
    example: 7,
  }),
  response: ApiResponse({
    status: 200,
    description: '투두 삭제 성공',
    schema: {
      type: 'object',
      properties: {
        messsage: {
          type: 'object',
          properties: {
            code: { type: 'number', example: '응답 코드(200) | number' },
            text: {
              type: 'string',
              example: '투두가 삭제되었습니다. | string',
            },
          },
        },
      },
      example: {
        messsage: {
          code: '응답 코드(200) | number',
          text: '투두가 삭제되었습니다. | string',
        },
      },
    },
  }),
};
