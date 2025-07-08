import { Controller, Get, ParseIntPipe, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { SseService } from './sse.service';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Get('subscribe')
  subscribe(
    @Query('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ) {
    this.sseService.subscribe(userId, res);
  }
}
