import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CoupleService } from './couple.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('couple')
export class CoupleController {
  constructor(private readonly coupleService: CoupleService) {}

  @Get(':coupleId')
  @UseGuards(AuthGuard('jwt'))
  async getCoupleData(@Param('coupleId') coupleId: number) {
    return await this.coupleService.getCoupleData(coupleId);
  }
}
