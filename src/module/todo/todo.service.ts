import { Injectable } from '@nestjs/common';
import { getCoupleUsersIds } from 'src/common/utils/couple.util';
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
    const todos = await this.prisma.todo.findMany({
      where: { coupleId },
    });

    const users = await getCoupleUsersIds(coupleId);

    const todosByUser: Record<number, { nickname: string; todos: any[] }> = {};
    for (const key of ['a', 'b']) {
      const user = users[key];
      todosByUser[user.id] = {
        nickname: user.nickname,
        todos: todos.filter((todo) => todo.writerId === user.id),
      };
    }

    return { todosByUser };
  }
}
