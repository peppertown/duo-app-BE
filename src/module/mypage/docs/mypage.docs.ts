import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const getMypageDocs = {
  operation: ApiOperation({
    summary: '마이페이지 조회',
    description: '로그인한 사용자의 마이페이지 정보를 조회합니다.',
  }),
  response: ApiResponse({
    status: 200,
    description: '마이페이지 조회 응답',
    schema: {
      type: 'object',
      example: {
        message: {
          code: '응답 코드 | number',
          text: '마이페이지 조회가 완료되었습니다. | string',
        },
        anniv: [
          {
            id: '기념일 ID(null 가능) | number',
            type: '기념일 유형 또는 이름 | string',
            days: 'D-Day 남은 일수 | number',
            date: '기념일 날짜 | ISO 8601 string',
          },
        ],
      },
    },
  }),
};
