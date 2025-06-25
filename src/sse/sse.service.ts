import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class SseService {
  constructor(private readonly redis: RedisService) {}
  private clients: Map<number, Response> = new Map();

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
}
