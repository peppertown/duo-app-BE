import { Module } from '@nestjs/common';
import { MemoService } from './memo.service';
import { MemoController } from './memo.controller';
import { CoupleModule } from '../couple/couple.module';
import { SseModule } from 'src/sse/sse.module';

@Module({
  imports: [CoupleModule, SseModule],
  controllers: [MemoController],
  providers: [MemoService],
})
export class MemoModule {}
