import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MemoService } from './memo.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('memo')
@Controller('memo')
export class MemoController {
  constructor(private readonly memoService: MemoService) {}

  @Post(':coupleId')
  @UseGuards(AuthGuard('jwt'))
  async createMemo(
    @CurrentUserId() userId: number,
    @Param('coupleId') coupleId: number,
    @Body('content') content: string,
  ) {
    return this.memoService.createMemo(userId, coupleId, content);
  }

  @Get(':coupleId')
  @UseGuards(AuthGuard('jwt'))
  async getMemo(
    @CurrentUserId() userId: number,
    @Param('coupleId') coupleId: number,
  ) {
    return this.memoService.getMemo(userId, coupleId);
  }

  @Post(':coupleId/widget/:memoId')
  @UseGuards(AuthGuard('jwt'))
  async setWidgetMemo(
    @CurrentUserId() userId: number,
    @Param('coupleId') coupleId: number,
    @Param('memoId') memoId: number,
  ) {
    return this.memoService.setWidgetMemo(userId, coupleId, memoId);
  }

  @Delete(':coupleId/:memoId')
  @UseGuards(AuthGuard('jwt'))
  async deleteMemo(
    @CurrentUserId() userId: number,
    @Param('coupleId') coupleId: number,
    @Param('memoId') memoId: number,
  ) {
    return this.memoService.deleteMemo(userId, coupleId, memoId);
  }

  @Put(':coupleId/:memoId')
  @UseGuards(AuthGuard('jwt'))
  async updateMemo(
    @CurrentUserId() userId: number,
    @Param('coupleId') coupleId: number,
    @Param('memoId') memoId: number,
    @Body('content') content: string,
  ) {
    return this.memoService.updateMemo(userId, coupleId, memoId, content);
  }
}
