import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CoupleService } from './couple.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';

@Controller('couple')
export class CoupleController {
  constructor(private readonly coupleService: CoupleService) {}

  @Get(':coupleId')
  @UseGuards(AuthGuard('jwt'))
  async getCoupleData(@Param('coupleId') coupleId: number) {
    return await this.coupleService.getCoupleData(coupleId);
  }

  @Post(':coupleId/anniversary')
  @UseGuards(AuthGuard('jwt'))
  async setAnniversary(
    @CurrentUserId() userId: number,
    @Param('coupleId') coupleId: number,
    @Body('anniversary') anniversary: string,
  ) {
    return await this.coupleService.setAnniversary(
      userId,
      coupleId,
      anniversary,
    );
  }
}
