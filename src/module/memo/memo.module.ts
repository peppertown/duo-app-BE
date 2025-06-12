import { Module } from '@nestjs/common';
import { MemoService } from './memo.service';
import { MemoController } from './memo.controller';
import { CoupleModule } from '../couple/couple.module';

@Module({
  imports: [CoupleModule],
  controllers: [MemoController],
  providers: [MemoService],
})
export class MemoModule {}
