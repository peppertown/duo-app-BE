import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as crypto from 'crypto';

@Injectable()
export class S3Service {
  private s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  private bucketName = process.env.AWS_S3_BUCKET_NAME;

  async uploadImageToS3(file: Express.Multer.File, prefix: string) {
    if (!file) {
      throw new BadRequestException('파일이 제공되지 않았습니다.');
    }

    const fileType = file.mimetype.split('/')[1];
    if (!fileType) {
      throw new BadRequestException('유효하지 않은 파일 형식입니다.');
    }

    const fileName = `ourown/${prefix}/${crypto.randomUUID()}.${fileType}`;

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      // S3 public인 경우 바로 URL 생성
      const imageUrl = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
      return { success: true, imageUrl };
    } catch (error) {
      console.error('S3 v3 이미지 업로드 에러', error);
      throw new InternalServerErrorException('이미지 업로드에 실패했습니다.');
    }
  }
}
