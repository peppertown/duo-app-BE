import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { CoupleModule } from '../couple/couple.module';
import { SseModule } from 'src/sse/sse.module';

@Module({
  imports: [CoupleModule, SseModule],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
