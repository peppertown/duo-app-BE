import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createSchedule(
    @CurrentUserId() userId: number,
    @Body()
    body: {
      coupleId: number;
      title: string;
      start: string;
      end: string;
    },
  ) {
    return await this.calendarService.createSchdule(
      userId,
      body.coupleId,
      body.title,
      body.start,
      body.end,
    );
  }

  @Get('')
  @UseGuards(AuthGuard('jwt'))
  async getMonthlySchedule(
    @CurrentUserId() userId: number,
    @Query('coupleId') coupleId: number,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    return await this.calendarService.getMonthlySchedule(
      userId,
      coupleId,
      year,
      month,
    );
  }
}
