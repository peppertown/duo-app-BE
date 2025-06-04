import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  createTodoDocs,
  deleteTodoDocs,
  getTodosDocs,
  todoDoneHandlerDocs,
} from './docs/todo.docs';

@ApiTags('todo')
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @createTodoDocs.operation
  @createTodoDocs.body
  @createTodoDocs.response
  async createTodo(
    @CurrentUserId() userId: number,
    @Body() body: { coupleId: number; content: string },
  ) {
    return await this.todoService.createTodo(
      userId,
      body.coupleId,
      body.content,
    );
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @getTodosDocs.operation
  @getTodosDocs.query
  @getTodosDocs.response
  async getTodos(
    @CurrentUserId() userId: number,
    @Query('coupleId') coupleId: number,
  ) {
    return await this.todoService.getTodos(userId, coupleId);
  }

  @Post(':todoId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @todoDoneHandlerDocs.operation
  @todoDoneHandlerDocs.param
  @todoDoneHandlerDocs.response
  async todoDoneHandler(
    @CurrentUserId() userId: number,
    @Param('todoId') todoId: number,
  ) {
    return await this.todoService.todoDoneHandler(userId, todoId);
  }

  @Delete(':todoId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @deleteTodoDocs.operation
  @deleteTodoDocs.param
  @deleteTodoDocs.response
  async deleteTodo(
    @CurrentUserId() userId: number,
    @Param('todoId') todoId: number,
  ) {
    return await this.todoService.deleteTodo(userId, todoId);
  }
}
