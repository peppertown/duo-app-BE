export interface ImageUploader {
  upload(
    file: Express.Multer.File,
    key: string,
  ): Promise<{ success: boolean; imageUrl: string }>;
}
