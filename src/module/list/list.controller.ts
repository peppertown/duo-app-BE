import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ListService } from './list.service';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { AuthGuard } from '@nestjs/passport';
import {
  createListDocs,
  getListDocs,
  listDoneHandlerDocs,
} from './docs/list.docs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('list')
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get(':coupleId/:listId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @getListDocs.operation
  @getListDocs.param1
  @getListDocs.param2
  @getListDocs.response
  async getList(
    @CurrentUserId() userId: number,
    @Param('listId') listId: number,
    @Param('coupleId') coupleId: number,
  ) {
    return await this.listService.getList(userId, coupleId, listId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @createListDocs.operation
  @createListDocs.body
  @createListDocs.response
  async createList(
    @CurrentUserId() userId: number,
    @Body() body: { coupleId: number; listId: number; content: string },
  ) {
    return await this.listService.createList(
      userId,
      body.coupleId,
      body.listId,
      body.content,
    );
  }

  @Post(':contentId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @listDoneHandlerDocs.operation
  @listDoneHandlerDocs.body
  @listDoneHandlerDocs.param
  @listDoneHandlerDocs.response
  async listDoneHandler(
    @CurrentUserId() userId: number,
    @Param('contentId') contentId: number,
    @Body() body: { coupleId: number; listId: number },
  ) {
    return await this.listService.listDoneHandler(
      userId,
      body.coupleId,
      body.listId,
      contentId,
    );
  }
}
