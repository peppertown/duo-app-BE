import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getCoupleUsersData } from 'src/common/utils/couple.util';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  async createTodo(userId: number, coupleId: number, content: string) {
    const todo = await this.prisma.todo.create({
      data: { coupleId, writerId: userId, content, isDone: false },
    });

    return {
      message: { code: 200, text: '투두 등록이 완료되었습니다' },
      todo,
    };
  }

  async getTodos(userId: number, coupleId: number) {
    if (!coupleId) {
      return await this.getSoloTodo(userId);
    }

    const todos = await this.prisma.todo.findMany({
      where: { coupleId },
    });

    const users = await getCoupleUsersData(coupleId);

    const todosByUser: Record<number, { nickname: string; todos: any[] }> = {};
    for (const key of ['a', 'b']) {
      const user = users[key];
      todosByUser[user.id] = {
        nickname: user.nickname,
        todos: todos.filter((todo) => todo.writerId === user.id),
      };
    }

    return {
      message: { code: 200, text: '투두 조회에 성공했습니다.' },
      todosByUser,
    };
  }

  async getSoloTodo(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    const todos = await this.prisma.todo.findMany({
      where: { writerId: userId },
    });

    const todosByUser = {
      [userId]: {
        nickname: user.nickname,
        todos,
      },
    };

    return {
      message: { code: 200, text: '투두 조회에 성공했습니다.' },
      todosByUser,
    };
  }

  async todoDoneHandler(userId: number, todoId: number) {
    try {
      const auth = await this.confirmTodoAuth(userId, todoId);

      const result = await this.prisma.todo.update({
        where: { id: todoId },
        data: { isDone: !auth.isDone },
      });

      return {
        messsage: { code: 200, text: '투두 완료 상태가 변경되었습니다.' },
        todo: result,
      };
    } catch (err) {
      console.error('투두 완료 상태 변경 중 에러 발생', err);
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(
        '투두 완료 상태 변경 중 에러가 발생했습니다',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteTodo(userId: number, todoId: number) {
    try {
      await this.confirmTodoAuth(userId, todoId);

      await this.prisma.todo.delete({ where: { id: todoId } });

      return {
        messsage: { code: 200, text: '투두가 삭제되었습니다.' },
      };
    } catch (err) {
      console.error('투두 삭제 중 에러 발생', err);
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(
        '투두 삭제 중 에러가 발생했습니다',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async confirmTodoAuth(userId: number, todoId: number) {
    const todo = await this.prisma.todo.findUnique({ where: { id: todoId } });
    if (todo.writerId !== userId) {
      throw new HttpException('잘못된 접근입니다.', HttpStatus.BAD_REQUEST);
    }

    return todo;
  }
}
