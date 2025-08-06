import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationHelper {
  constructor(private readonly prisma: PrismaService) {}

  // 유저 푸시 토큰 확인
  async getUserPushToken(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { pushToken: true },
    });

    return user.pushToken;
  }
}
