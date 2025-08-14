import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export interface CreateUserData {
  email: string;
  password?: string;
  nickname: string;
  code: string;
  profileUrl: string;
  sub?: string;
  authProvider?: string;
}

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  // AuthHelper에서 사용하는 메서드들
  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  async findBySub(sub: string) {
    return this.prisma.user.findUnique({
      where: { sub },
    });
  }

  async create(data: CreateUserData) {
    return this.prisma.user.create({
      data,
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Partial<CreateUserData>) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async findByCode(code: string) {
    return this.prisma.user.findUnique({
      where: { code },
    });
  }

  async updateNickname(id: number, nickname: string) {
    return this.prisma.user.update({
      where: { id },
      data: { nickname },
    });
  }

  async updateBirthday(id: number, birthday: Date) {
    return this.prisma.user.update({
      where: { id },
      data: { birthday },
    });
  }

  async updateProfileUrl(id: number, profileUrl: string) {
    return this.prisma.user.update({
      where: { id },
      data: { profileUrl },
    });
  }
}
