import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { SseService } from './sse.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Get('subscribe')
  @UseGuards(AuthGuard('jwt'))
  subscribe(@CurrentUserId() userId: number, @Res() res: Response) {
    this.sseService.subscribe(userId, res);
  }
}
