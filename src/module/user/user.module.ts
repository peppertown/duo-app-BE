import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { UploaderModule } from 'src/uploader/uploader.module';

@Module({
  imports: [AuthModule, UploaderModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
