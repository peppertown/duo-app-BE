import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import {
  createScheduleDocs,
  getMonthlyScheduleDocs,
} from './docs/calendar.docs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @createScheduleDocs.operation
  @createScheduleDocs.body
  @createScheduleDocs.response
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

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @getMonthlyScheduleDocs.operation
  @getMonthlyScheduleDocs.query1
  @getMonthlyScheduleDocs.query2
  @getMonthlyScheduleDocs.query3
  @getMonthlyScheduleDocs.response
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
