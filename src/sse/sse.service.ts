import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    try {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      this.clients.set(Number(userId), res);
      console.log('SSE 연결됨', userId);
      console.log(typeof userId);

      // 연결 종료 시
      res.on('close', () => {
        this.clients.delete(userId);
      });
    } catch (err) {
      console.error('SSE 연결 중 에러 발생', err);
      throw new HttpException(
        'SSE 연결 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 알림 생성 및 전송
  async createNofication(
    userId: number,
    type: NotificationType,
    payload: string,
  ) {
    try {
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
    } catch (err) {
      console.error('알림 생성 중 에러 발생', err);
      throw new HttpException(
        '알림 생성 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
