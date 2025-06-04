import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './module/user/user.module';
import { TodoModule } from './module/todo/todo.module';
import { S3Module } from './s3/s3.module';
import { CoupleModule } from './module/couple/couple.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    TodoModule,
    S3Module,
    CoupleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
