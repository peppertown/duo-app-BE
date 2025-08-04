import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ImageUploader } from './uploader.interface';

@Injectable()
export class S3UploaderService implements ImageUploader {
  private s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  private bucketName = process.env.AWS_S3_BUCKET_NAME;

  async upload(file: Express.Multer.File, key: string) {
    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      const imageUrl = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      return { success: true, imageUrl };
    } catch (error) {
      console.error('S3 이미지 업로드 중 에러 발생', error);
      throw new HttpException(
        'S3 이미지 업로드 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
