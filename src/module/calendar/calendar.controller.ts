import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('')
  @UseGuards(AuthGuard('jwt'))
  async createSchedule(
    @CurrentUserId() userId: number,
    @Body() body: { coupleId: number; date: string; content: string },
  ) {
    return await this.calendarService.createSchdule(
      userId,
      body.coupleId,
      body.date,
      body.content,
    );
  }
}
