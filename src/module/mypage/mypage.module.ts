import { Module } from '@nestjs/common';
import { MypageService } from './mypage.service';
import { MypageController } from './mypage.controller';
import { CoupleModule } from '../couple/couple.module';

@Module({
  imports: [CoupleModule],
  controllers: [MypageController],
  providers: [MypageService],
})
export class MypageModule {}
