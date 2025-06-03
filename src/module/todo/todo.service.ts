import { Injectable } from '@nestjs/common';
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
}
