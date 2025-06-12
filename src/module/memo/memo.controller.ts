import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MemoService } from './memo.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';

@Controller('memo')
export class MemoController {
  constructor(private readonly memoService: MemoService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createMemo(
    @CurrentUserId() userId: number,
    @Body() body: { coupleId: number; memoId: number; content: string },
  ) {
    return await this.memoService.createMemo(
      userId,
      body.coupleId,
      body.memoId,
      body.content,
    );
  }
}
