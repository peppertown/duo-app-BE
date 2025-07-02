import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ListService } from './list.service';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { AuthGuard } from '@nestjs/passport';
import {
  createListDocs,
  deleteListDocs,
  getListDocs,
  listDoneHandlerDocs,
} from './docs/list.docs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('list')
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get(':coupleId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @getListDocs.operation
  @getListDocs.param1
  @getListDocs.response
  async getList(
    @CurrentUserId() userId: number,
    @Param('coupleId', ParseIntPipe) coupleId: number,
  ) {
    return await this.listService.getList(userId, coupleId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @createListDocs.operation
  @createListDocs.body
  @createListDocs.response
  async createList(
    @CurrentUserId() userId: number,
    @Body() body: { coupleId: number; categoryId: number; content: string },
  ) {
    return await this.listService.createList(
      userId,
      body.coupleId,
      body.categoryId,
      body.content,
    );
  }

  @Post(':coupleId/:contentId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @listDoneHandlerDocs.operation
  @listDoneHandlerDocs.param1
  @listDoneHandlerDocs.param2
  @listDoneHandlerDocs.response
  async listDoneHandler(
    @CurrentUserId() userId: number,
    @Param('coupleId', ParseIntPipe) coupleId: number,
    @Param('contentId', ParseIntPipe) contentId: number,
  ) {
    return await this.listService.listDoneHandler(userId, coupleId, contentId);
  }

  @Delete(':coupleId/:contentId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @deleteListDocs.operation
  @deleteListDocs.param1
  @deleteListDocs.param2
  @deleteListDocs.response
  async deleteList(
    @CurrentUserId() userId: number,
    @Param('coupleId', ParseIntPipe) coupleId: number,
    @Param('contentId', ParseIntPipe) contentId: number,
  ) {
    return await this.listService.deleteList(userId, coupleId, contentId);
  }
}
