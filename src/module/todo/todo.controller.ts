import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
}
