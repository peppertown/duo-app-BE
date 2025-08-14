import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getCoupleUsersData } from 'src/common/utils/couple.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { TodoRepository } from 'src/common/repositories/todo.repository';
import {
  groupTodosByUser,
  formatSoloTodoData,
  formatApiResponse,
} from './utils/todo.util';

@Injectable()
export class TodoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly todoRepository: TodoRepository,
  ) {}

  async createTodo(userId: number, coupleId: number, content: string) {
    const todo = await this.todoRepository.createTodo({
      coupleId,
      writerId: userId,
      content,
      isDone: false,
    });

    return formatApiResponse(200, '투두 등록이 완료되었습니다', { todo });
  }

  async getTodos(userId: number, coupleId: number) {
    if (!coupleId) {
      return await this.getSoloTodo(userId);
    }

    const todos = await this.todoRepository.findTodosByCoupleId(coupleId);

    const users = await getCoupleUsersData(coupleId);
    const todosByUser = groupTodosByUser(todos, users);

    return formatApiResponse(200, '투두 조회에 성공했습니다.', {
      todosByUser,
    });
  }

  async getSoloTodo(userId: number) {
    const user = await this.todoRepository.findUserById(userId);

    const todos = await this.todoRepository.findTodosByWriterId(userId);
    const todosByUser = formatSoloTodoData(userId, user, todos);

    return formatApiResponse(200, '투두 조회에 성공했습니다.', {
      todosByUser,
    });
  }

  async todoDoneHandler(userId: number, todoId: number) {
    const auth = await this.confirmTodoAuth(userId, todoId);

    const result = await this.todoRepository.updateTodo(todoId, {
      isDone: !auth.isDone,
    });

    return formatApiResponse(200, '투두 완료 상태가 변경되었습니다.', {
      todo: result,
    });
  }

  async deleteTodo(userId: number, todoId: number) {
    await this.confirmTodoAuth(userId, todoId);

    await this.todoRepository.deleteTodo(todoId);

    return formatApiResponse(200, '투두가 삭제되었습니다.');
  }

  async confirmTodoAuth(userId: number, todoId: number) {
    const todo = await this.todoRepository.findTodoById(todoId);
    if (todo.writerId !== userId) {
      throw new HttpException('잘못된 접근입니다.', HttpStatus.BAD_REQUEST);
    }

    return todo;
  }
}
