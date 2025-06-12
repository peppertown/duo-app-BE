import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MemoService } from './memo.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { createMemoDocs, getMemoDocs } from './docs/memo.docs';

@ApiTags('memo')
@Controller('memo')
export class MemoController {
  constructor(private readonly memoService: MemoService) {}

  @Get(':coupleId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @getMemoDocs.operation
  @getMemoDocs.param1
  @getMemoDocs.response
  async getMemo(
    @CurrentUserId() userId: number,
    @Param('coupleId') coupleId: number,
  ) {
    return await this.memoService.getMemo(userId, coupleId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @createMemoDocs.operation
  @createMemoDocs.body
  @createMemoDocs.response
  async createMemo(
    @CurrentUserId() userId: number,
    @Body() body: { coupleId: number; content: string },
  ) {
    return await this.memoService.createMemo(
      userId,
      body.coupleId,
      body.content,
    );
  }
}
