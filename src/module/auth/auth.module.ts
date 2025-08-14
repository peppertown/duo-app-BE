import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from 'src/redis/redis.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { CoupleModule } from '../couple/couple.module';
import { NotificationModule } from '../notification/notification.module';
import { AuthHelper } from './helper/auth.helper';
import { ConfigService } from 'src/config/config.service';
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.jwtSecret,
        signOptions: {
          expiresIn: configService.jwtExpiresIn,
        },
      }),
    }),
    RedisModule,
    CoupleModule,
    NotificationModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AuthHelper],
  exports: [AuthService],
})
export class AuthModule {}
