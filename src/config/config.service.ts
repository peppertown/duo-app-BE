import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ConfigService {
  constructor() {
    this.validateRequiredVariables();
  }

  private get(key: string, defaultValue?: string): string {
    const value = process.env[key];
    if (value !== undefined) return value;
    if (defaultValue !== undefined) return defaultValue;
    throw new HttpException(
      `필수 환경 변수 '${key}'가 설정되지 않았습니다.`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  private validateRequiredVariables() {
    const required = ['JWT_SECRET', 'DATABASE_URL', 'REDIS_HOST', 'REDIS_PORT'];

    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      throw new HttpException(
        `다음 필수 환경 변수가 설정되지 않았습니다: ${missing.join(', ')}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Server Configuration
  get port(): number {
    const portStr = this.get('PORT', '3000');
    const port = parseInt(portStr, 10);

    if (isNaN(port) || port <= 0 || port > 65535) {
      throw new HttpException(
        `유효하지 않은 PORT 값입니다: ${portStr}. 1-65535 사이의 숫자여야 합니다.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return port;
  }

  get nodeEnv(): string {
    return this.get('NODE_ENV', 'development');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  // JWT Configuration
  get jwtSecret(): string {
    const secret = this.get('JWT_SECRET');

    return secret;
  }

  get jwtExpiresIn(): string {
    return this.get('JWT_EXPIRES_IN', '1h');
  }

  get jwtRefreshExpiresIn(): string {
    return this.get('JWT_REFRESH_EXPIRES_IN', '7d');
  }

  // Database Configuration
  get databaseUrl(): string {
    const url = this.get('DATABASE_URL');

    if (!url.startsWith('mysql://')) {
      throw new HttpException(
        'DATABASE_URL은 mysql:// 형식이어야 합니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return url;
  }

  // Redis Configuration
  get redisHost(): string {
    return this.get('REDIS_HOST');
  }

  get redisPort(): number {
    const portStr = this.get('REDIS_PORT');
    const port = parseInt(portStr, 10);

    if (isNaN(port) || port <= 0 || port > 65535) {
      throw new HttpException(
        `유효하지 않은 REDIS_PORT 값입니다: ${portStr}. 1-65535 사이의 숫자여야 합니다.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return port;
  }

  get redisPassword(): string | undefined {
    return process.env.REDIS_PASSWORD;
  }

  // JWT Keys
  get refreshKeyJwt(): string {
    return this.get('REFRESH_KEY_JWT', 'refresh_token');
  }

  // Default URLs
  get defaultProfileUrl(): string {
    return this.get(
      'DEFAULT_PROFILE_URL',
      'https://example.com/default-profile.png',
    );
  }

  get defaultWidgetUrl(): string {
    return this.get(
      'DEFAULT_WIDGET_URL',
      'https://example.com/default-widget.png',
    );
  }

  // OAuth Configuration
  get googleClientId(): string {
    return this.get('GOOGLE_CLIENT_ID');
  }

  get googleClientSecret(): string {
    return this.get('GOOGLE_CLIENT_SECRET');
  }

  get googleRedirectUri(): string {
    return this.get('GOOGLE_REDIRECT_URI');
  }

  get deeplinkUrl(): string {
    return this.get('DEEPLINK_URL');
  }

  get googleSecureState(): string {
    return this.get('GOOGLE_SECURE_STATE');
  }

  // S3 Configuration
  get awsRegion(): string {
    return this.get('AWS_REGION');
  }

  get s3AccessKey(): string {
    return this.get('S3_ACCESS_KEY');
  }

  get s3SecretAccessKey(): string {
    return this.get('S3_SECRET_ACCESS_KEY');
  }

  get awsS3BucketName(): string {
    return this.get('AWS_S3_BUCKET_NAME');
  }
}
