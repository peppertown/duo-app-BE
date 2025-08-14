import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export interface CreateTodoData {
  coupleId: number;
  writerId: number;
  content: string;
  isDone: boolean;
}

@Injectable()
export class TodoRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Todo 테이블 메서드
  async createTodo(data: CreateTodoData) {
    return this.prisma.todo.create({
      data,
    });
  }

  async findTodosByCoupleId(coupleId: number) {
    return this.prisma.todo.findMany({
      where: { coupleId },
    });
  }

  async findTodosByWriterId(writerId: number) {
    return this.prisma.todo.findMany({
      where: { writerId },
    });
  }

  async findTodoById(id: number) {
    return this.prisma.todo.findUnique({
      where: { id },
    });
  }

  async updateTodo(id: number, data: { isDone: boolean }) {
    return this.prisma.todo.update({
      where: { id },
      data,
    });
  }

  async deleteTodo(id: number) {
    return this.prisma.todo.delete({
      where: { id },
    });
  }

  // User 테이블 메서드 (solo todo용)
  async findUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
