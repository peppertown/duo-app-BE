import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(data: {
    id: string;
    password: string;
    nickname: string;
    role: string;
  }) {
    const { id, password, nickname, role } = data;

    // 중복 확인
    const existingUser = await this.prisma.user.findUnique({
      where: { userId: id },
    });
    if (existingUser) {
      throw new BadRequestException('이미 존재하는 사용자 ID입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        userId: id,
        password: hashedPassword,
        nickname,
        role,
      },
    });

    return {
      message: '회원가입 성공',
      user: {
        id: newUser.id,
        userId: newUser.userId,
        nickname: newUser.nickname,
      },
    };
  }

  // 로그인
  async login(data: { id: string; password: string }) {
    const { id, password } = data;

    const user = await this.prisma.user.findUnique({
      where: { userId: id },
    });

    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('비밀번호가 올바르지 않습니다.');
    }

    return {
      message: '로그인 성공',
      user: {
        id: user.id,
        userId: user.userId,
        nickname: user.nickname,
      },
    };
  }
}
