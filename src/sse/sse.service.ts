import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class SseService {
  constructor(
    private readonly redis: RedisService,
    private readonly prisma: PrismaService,
  ) {}
  private clients: Map<number, Response> = new Map();

  // SSE 연결
  subscribe(userId: number, res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    this.clients.set(userId, res);

    // 연결 종료 시
    res.on('close', () => {
      this.clients.delete(userId);
    });
  }

  // 알림 생성 및 전송
  async createNofication(
    userId: number,
    type: NotificationType,
    payload: JSON,
  ) {
    await this.prisma.notification.create({
      data: {
        userId,
        type,
        payload: JSON.stringify(payload),
      },
    });

    const client = this.clients.get(userId);
    if (client) {
      client.write(`data: ${JSON.stringify({ type, payload })}\n\n`);
    }
  }
}
