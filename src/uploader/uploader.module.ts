import { Module } from '@nestjs/common';
import { S3UploaderService } from './s3-uploader.service';

@Module({
  providers: [{ provide: 'ImageUploader', useClass: S3UploaderService }],
  exports: ['ImageUploader'],
})
export class UploaderModule {}
