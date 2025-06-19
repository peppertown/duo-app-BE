import { ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';

export const createMemoDocs = {
  operation: ApiOperation({
    summary: '메모 등록',
    description: '커플 ID에 해당하는 메모를 등록합니다.',
  }),
  param: ApiParam({
    name: 'coupleId',
    required: true,
    description: '커플 ID',
    example: '커플 ID | number',
  }),
  body: ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          example: '메모 내용 | string',
        },
      },
      required: ['content'],
    },
  }),
  response: ApiResponse({
    status: 200,
    description: '메모 등록 응답',
    schema: {
      type: 'object',
      example: {
        message: {
          code: '응답 코드 | number',
          text: '결과 메시지 | string',
        },
        memo: {
          id: '메모 ID | number',
          content: '메모 내용 | string',
          createdAt: '생성 일시 | ISO 8601 string',
          user: {
            id: '유저 ID | number',
            nickname: '유저 닉네임 | string',
          },
          isWidgetMemo: '위젯 메모 여부 | boolean',
        },
      },
    },
  }),
};

export const updateMemoDocs = {
  operation: ApiOperation({
    summary: '메모 수정',
    description: '커플 ID와 메모 ID를 통해 메모 내용을 수정합니다.',
  }),
  paramCoupleId: ApiParam({
    name: 'coupleId',
    required: true,
    description: '커플 ID',
    example: '커플 ID | number',
  }),
  paramMemoId: ApiParam({
    name: 'memoId',
    required: true,
    description: '메모 ID',
    example: '메모 ID | number',
  }),
  body: ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          example: '수정할 메모 내용 | string',
        },
      },
      required: ['content'],
    },
  }),
  response: ApiResponse({
    status: 200,
    description: '메모 수정 응답',
    schema: {
      type: 'object',
      example: {
        message: {
          code: '응답 코드 | number',
          text: '결과 메시지 | string',
        },
        memo: {
          id: '메모 ID | number',
          content: '메모 내용 | string',
          createdAt: '생성 일시 | ISO 8601 string',
          user: {
            id: '유저 ID | number',
            nickname: '유저 닉네임 | string',
          },
          isWidgetMemo: '위젯 메모 여부 | boolean',
        },
      },
    },
  }),
};

export const getMemoDocs = {
  operation: ApiOperation({
    summary: '메모 조회',
    description: '커플 ID에 해당하는 메모를 조회합니다.',
  }),
  param: ApiParam({
    name: 'coupleId',
    required: true,
    description: '커플 ID',
    example: '커플 ID | number',
  }),
  response: ApiResponse({
    status: 200,
    description: '메모 조회 응답',
    schema: {
      type: 'object',
      example: {
        message: {
          code: '응답 코드 | number',
          text: '결과 메시지 | string',
        },
        memo: [
          {
            id: '메모 ID | number',
            content: '메모 내용 | string',
            createdAt: '생성 일시 | ISO 8601 string',
            user: {
              id: '유저 ID | number',
              nickname: '유저 닉네임 | string',
            },
            isWidgetMemo: '위젯 메모 여부 | boolean',
          },
        ],
      },
    },
  }),
};

export const setWidgetMemoDocs = {
  operation: ApiOperation({
    summary: '위젯 메모 설정',
    description: '커플 ID와 메모 ID를 통해 위젯 메모를 설정합니다.',
  }),
  paramCoupleId: ApiParam({
    name: 'coupleId',
    required: true,
    description: '커플 ID',
    example: '커플 ID | number',
  }),
  paramMemoId: ApiParam({
    name: 'memoId',
    required: true,
    description: '메모 ID',
    example: '메모 ID | number',
  }),
  response: ApiResponse({
    status: 200,
    description: '위젯 메모 설정 응답',
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

export const deleteMemoDocs = {
  operation: ApiOperation({
    summary: '메모 삭제',
    description: '커플 ID와 메모 ID를 통해 메모를 삭제합니다.',
  }),
  paramCoupleId: ApiParam({
    name: 'coupleId',
    required: true,
    description: '커플 ID',
    example: '커플 ID | number',
  }),
  paramMemoId: ApiParam({
    name: 'memoId',
    required: true,
    description: '메모 ID',
    example: '메모 ID | number',
  }),
  response: ApiResponse({
    status: 200,
    description: '메모 삭제 응답',
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
