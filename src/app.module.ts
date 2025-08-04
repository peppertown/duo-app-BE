import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './module/user/user.module';
import { TodoModule } from './module/todo/todo.module';
import { S3Module } from './s3/s3.module';
import { CoupleModule } from './module/couple/couple.module';
import { MemoModule } from './module/memo/memo.module';
import { ListModule } from './module/list/list.module';
import { SseModule } from './sse/sse.module';
import { CronModule } from './cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from './module/notification/notification.module';
import { MypageModule } from './module/mypage/mypage.module';
import { UploaderModule } from './uploader/uploader.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    TodoModule,
    S3Module,
    CoupleModule,
    MemoModule,
    ListModule,
    SseModule,
    CronModule,
    ScheduleModule.forRoot(),
    NotificationModule,
    MypageModule,
    UploaderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
