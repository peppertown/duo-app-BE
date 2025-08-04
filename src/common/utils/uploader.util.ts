import { HttpException, HttpStatus } from '@nestjs/common';

// 업로드 이미지 파일 유효성 검사
export function validateFile(file: Express.Multer.File) {
  if (!file) {
    throw new HttpException(
      '파일이 제공되지 않았습니다.',
      HttpStatus.BAD_REQUEST,
    );
  }

  if (!file.mimetype.startsWith('image/')) {
    throw new HttpException(
      '이미지 파일만 업로드할 수 있습니다.',
      HttpStatus.BAD_REQUEST,
    );
  }
}

// 업로드 이미지 파일 이름 생성
export function generateFileName(prefix: string, file: Express.Multer.File) {
  const fileType = file.mimetype.split('/')[1];
  const fileName = `ourown/${prefix}/${crypto.randomUUID()}.${fileType}`;

  return fileName;
}
