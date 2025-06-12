import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { CoupleModule } from '../couple/couple.module';

@Module({
  imports: [CoupleModule],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
