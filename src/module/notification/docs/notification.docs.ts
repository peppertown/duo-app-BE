import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

export const getNotificationsDocs = {
  operation: ApiOperation({
    summary: '알림 목록 조회 API',
    description: '사용자의 모든 알림을 조회합니다.',
  }),
  response: ApiResponse({
    status: 200,
    description: '알림 목록 조회 성공',
    schema: {
      type: 'object',
      example: {
        message: {
          code: '200',
          text: '알림 조회가 완료되었습니다.',
        },
        notifications: [
          {
            id: '알림 ID | number',
            type: '알림 타입 | string',
            payload: '알림 내용 | JSON string',
            isRead: '읽음 여부 | boolean',
            createdAt: '생성 일시 | ISO 8601 string',
          },
        ],
      },
    },
  }),
};

export const deleteNotificationDocs = {
  operation: ApiOperation({
    summary: '알림 삭제 API',
    description: '특정 알림을 삭제합니다.',
  }),
  param: ApiParam({
    name: 'notificationId',
    required: true,
    description: '삭제할 알림의 ID',
    example: 1,
  }),
  response: ApiResponse({
    status: 200,
    description: '알림 삭제 성공',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'object',
          properties: {
            code: { type: 'number', example: 200 },
            text: { type: 'string', example: '알림이 삭제되었습니다.' },
          },
        },
      },
    },
  }),
};

export const deleteAllNotificationDocs = {
  operation: ApiOperation({
    summary: '알림 전체 삭제',
    description: '사용자의 모든 알림을 삭제합니다.',
  }),
  response: ApiResponse({
    status: 200,
    description: '알림 전체 삭제 응답',
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
