import {
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiBody,
  ApiResponse,
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
          anniversary: '기념일(ISO 문자열)',
        },
      },
    },
  }),
};

export const addAnniversaryDocs = {
  operation: ApiOperation({
    summary: '커플 기념일 등록',
    description: '커플 ID에 해당하는 기념일을 등록합니다.',
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
        title: {
          type: 'string',
          example: '기념일 제목 | string',
        },
        date: {
          type: 'string',
          format: 'date',
          example: '기념일 날짜 (yyyy-mm-dd) | string',
        },
      },
      required: ['title', 'date'],
    },
  }),
  response: ApiResponse({
    status: 200,
    description: '기념일 등록 응답',
    schema: {
      type: 'object',
      example: {
        message: {
          code: '응답 코드 | number',
          text: '기념일 등록이 완료되었습니다. | string',
        },
        anniv: {
          id: '기념일 ID | number',
          title: '기념일 제목 | string',
          date: '기념일 날짜 | string (ISO 8601)',
          days: 'D+일수 | number',
        },
      },
    },
  }),
};

export const updateAnniversaryDocs = {
  operation: ApiOperation({
    summary: '기념일 수정',
    description: '기존에 등록된 기념일의 제목과 날짜를 수정합니다.',
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
        id: {
          type: 'number',
          example: '기념일 ID | number',
        },
        title: {
          type: 'string',
          example: '기념일 제목 | string',
        },
        date: {
          type: 'string',
          format: 'date',
          example: '기념일 날짜 (yyyy-mm-dd) | string',
        },
      },
      required: ['id', 'title', 'date'],
    },
  }),
  response: ApiResponse({
    status: 200,
    description: '기념일 수정 응답',
    schema: {
      type: 'object',
      example: {
        message: {
          code: '응답 코드 | number',
          text: '기념일 수정이 완료되었습니다. | string',
        },
        anniv: {
          id: '기념일 ID | number',
          title: '기념일 제목 | string',
          date: '기념일 날짜 | string (ISO 8601)',
          days: 'D+일수 | number',
        },
      },
    },
  }),
};

export const deleteAnniversaryDocs = {
  operation: ApiOperation({
    summary: '기념일 삭제',
    description: '등록된 기념일을 삭제합니다.',
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
        id: {
          type: 'number',
          example: '삭제할 기념일 ID | number',
        },
      },
      required: ['id'],
    },
  }),
  response: ApiResponse({
    status: 200,
    description: '기념일 삭제 응답',
    schema: {
      type: 'object',
      example: {
        message: {
          code: '응답 코드 | number',
          text: '기념일 삭제가 완료되었습니다. | string',
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

export const getCoupleAnniversariesDocs = {
  operation: ApiOperation({
    summary: '커플 기념일 조회',
    description: '커플의 기념일(D-day, 100일/주년, 각자 생일 등)을 조회합니다.',
  }),

  param: ApiParam({
    name: 'coupleId',
    type: 'number',
    required: true,
    description: '커플 id',
    example: 1,
  }),

  response: ApiOkResponse({
    status: 200,
    description: '커플 기념일 조회 완료',
    schema: {
      type: 'object',
      example: {
        message: {
          code: '응답 코드(200) | number',
          text: '커플 기념일 조회가 완료되었습니다. | string',
        },
        dday: '커플 D-day | number',
        anniv: [
          {
            type: '기념일 종류 | string (ex: 300일, 1주년, test1님 생일, test2님 생일)',
            days: '남은 일수 | number',
            date: '기념일 날짜(ISO 문자열) | string',
          },
        ],
      },
    },
  }),
};

export const getCoupleWidgetDocs = {
  operation: ApiOperation({
    summary: '커플 위젯 조회',
    description: '커플 ID를 통해 위젯 이미지를 조회합니다.',
  }),
  param: ApiParam({
    name: 'coupleId',
    required: true,
    description: '커플 ID',
    example: '커플 ID | number',
  }),
  response: ApiOkResponse({
    status: 200,
    description: '커플 위젯 조회 응답',
    schema: {
      type: 'object',
      example: {
        message: {
          code: '응답 코드 | number',
          text: '결과 메시지 | string',
        },
        widget: {
          photoUrl: '위젯 이미지 URL | string',
        },
      },
    },
  }),
};

export const setCoupleWidgetDocs = {
  operation: ApiOperation({
    summary: '커플 위젯 이미지 업로드',
    description: '커플 ID에 해당하는 위젯 이미지를 업로드합니다.',
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
        file: {
          type: 'string',
          format: 'binary',
          example: '업로드할 이미지 파일 | binary',
        },
      },
      required: ['file'],
    },
  }),
  response: ApiOkResponse({
    status: 200,
    description: '커플 위젯 이미지 업로드 응답',
    schema: {
      type: 'object',
      example: {
        message: {
          code: '응답 코드 | number',
          text: '결과 메시지 | string',
        },
        widget: {
          photoUrl: '업로드된 위젯 이미지 URL | string',
        },
      },
    },
  }),
};

export const deleteCoupleDocs = {
  operation: ApiOperation({
    summary: '커플 연결 해제',
    description: '커플 ID를 통해 커플 연결을 해제합니다.',
  }),
  param: ApiParam({
    name: 'coupleId',
    required: true,
    description: '커플 ID',
    example: '커플 ID | number',
  }),
  response: ApiOkResponse({
    status: 200,
    description: '커플 연결 해제 응답',
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
