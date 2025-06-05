import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CoupleService } from './couple.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  getCoupleDataDocs,
  setAnniversaryDocs,
  setCoupleNameDocs,
} from './docs/couple.docs';

@ApiTags('couple')
@Controller('couple')
export class CoupleController {
  constructor(private readonly coupleService: CoupleService) {}

  @Get(':coupleId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @getCoupleDataDocs.operation
  @getCoupleDataDocs.param
  @getCoupleDataDocs.response
  async getCoupleData(@Param('coupleId') coupleId: number) {
    return await this.coupleService.getCoupleData(coupleId);
  }

  @Post(':coupleId/anniversary')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @setAnniversaryDocs.operation
  @setAnniversaryDocs.param
  @setAnniversaryDocs.body
  @setAnniversaryDocs.response
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

  @Post(':coupleId/name')
  @UseGuards(AuthGuard('jwt'))
  @setCoupleNameDocs.operation
  @setCoupleNameDocs.param
  @setCoupleNameDocs.body
  @setCoupleNameDocs.response
  async setCoupleName(
    @CurrentUserId() userId: number,
    @Param('coupleId') coupleId: number,
    @Body('name') name: string,
  ) {
    return await this.coupleService.setCoupleName(userId, coupleId, name);
  }
}
