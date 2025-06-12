import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ListService } from './list.service';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get(':coupleId/:listId')
  @UseGuards(AuthGuard('jwt'))
  async getList(
    @CurrentUserId() userId: number,
    @Param('listId') listId: number,
    @Param('coupleId') coupleId: number,
  ) {
    return await this.listService.getList(userId, coupleId, listId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createMemo(
    @CurrentUserId() userId: number,
    @Body() body: { coupleId: number; memoId: number; content: string },
  ) {
    return await this.listService.createMemo(
      userId,
      body.coupleId,
      body.memoId,
      body.content,
    );
  }
}
