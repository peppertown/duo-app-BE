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

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
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
  async getTodos(@Query('coupleId') coupleId: number) {
    return await this.todoService.getTodos(coupleId);
  }

  @Post(':todoId')
  @UseGuards(AuthGuard('jwt'))
  async todoDoneHandler(
    @CurrentUserId() userId: number,
    @Param('todoId') todoId: number,
  ) {
    return await this.todoService.todoDoneHandler(userId, todoId);
  }

  @Delete(':todoId')
  @UseGuards(AuthGuard('jwt'))
  async deleteTodo(
    @CurrentUserId() userId: number,
    @Param('todoId') todoId: number,
  ) {
    return await this.todoService.deleteTodo(userId, todoId);
  }
}
