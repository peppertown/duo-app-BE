import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ImageUploader } from './uploader.interface';
import { generateFileName, validateFile } from 'src/uploader/uploader.util';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class S3UploaderService implements ImageUploader {
  private s3: S3Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.awsRegion,
      credentials: {
        accessKeyId: this.configService.s3AccessKey,
        secretAccessKey: this.configService.s3SecretAccessKey,
      },
    });

    this.bucketName = this.configService.awsS3BucketName;
  }

  async upload(file: Express.Multer.File, prefix: string) {
    try {
      // 유효성 검사
      validateFile(file);

      // 파일명 생성
      const fileName = generateFileName(prefix, file);

      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      const imageUrl = `https://${this.bucketName}.s3.${this.configService.awsRegion}.amazonaws.com/${prefix}`;
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
