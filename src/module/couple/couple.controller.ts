import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CoupleService } from './couple.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  deleteCoupleDocs,
  getCoupleAnniversariesDocs,
  getCoupleDataDocs,
  getCoupleWidgetDocs,
  setAnniversaryDocs,
  setCoupleNameDocs,
  setCoupleWidgetDocs,
} from './docs/couple.docs';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Get(':coupleId/anniversary')
  @ApiBearerAuth()
  @getCoupleAnniversariesDocs.operation
  @getCoupleAnniversariesDocs.param
  @getCoupleAnniversariesDocs.response
  async getCoupleAnniversaries(@Param('coupleId') coupleId: number) {
    return await this.coupleService.getCoupleAnniversaries(coupleId);
  }

  @Post(':coupleId/anniversary')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async addAnniversary(
    @CurrentUserId() userId: number,
    @Param('coupleId') coupleId: number,
    @Body('date') date: Date,
    @Body('title') title: string,
  ) {
    return await this.coupleService.addAnniversary(
      userId,
      coupleId,
      title,
      date,
    );
  }

  @Put(':coupleId/anniversary')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async updateAnniversary(
    @CurrentUserId() userId: number,
    @Param('coupleId') coupleId: number,
    @Body('id') id: number,
    @Body('date') date: Date,
    @Body('title') title: string,
  ) {
    return await this.coupleService.updateAnniversary(
      userId,
      coupleId,
      id,
      title,
      date,
    );
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
  @ApiBearerAuth()
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

  @Get(':coupleId/widget')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @getCoupleWidgetDocs.operation
  @getCoupleWidgetDocs.param
  @getCoupleWidgetDocs.response
  async getCoupleWidget(
    @CurrentUserId() userId: number,
    @Param('coupleId') coupleId: number,
  ) {
    return await this.coupleService.getCoupleWidget(userId, coupleId);
  }

  @Post(':coupleId/widget')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @setCoupleWidgetDocs.operation
  @setCoupleWidgetDocs.param
  @setCoupleWidgetDocs.body
  @setCoupleWidgetDocs.response
  async setCoupleWidget(
    @CurrentUserId() userId: number,
    @Param('coupleId') coupleId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.coupleService.setCoupleWidget(userId, coupleId, file);
  }

  @Delete(':coupleId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @deleteCoupleDocs.operation
  @deleteCoupleDocs.param
  @deleteCoupleDocs.response
  async deleteCouple(
    @CurrentUserId() userId: number,
    @Param('coupleId') coupleId: number,
  ) {
    return await this.coupleService.deleteCouple(userId, coupleId);
  }
}
