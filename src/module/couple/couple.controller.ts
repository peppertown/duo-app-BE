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
  addAnniversaryDocs,
  deleteAnniversaryDocs,
  deleteCoupleDocs,
  getCoupleAnniversariesDocs,
  getCoupleWidgetDocs,
  setAnniversaryDocs,
  setCoupleWidgetDocs,
  updateAnniversaryDocs,
} from './docs/couple.docs';
import { FileInterceptor } from '@nestjs/platform-express';
import { CoupleAuthGuard } from './guard/couple-auth-gaurd';

@ApiTags('couple')
@Controller('couple')
export class CoupleController {
  constructor(private readonly coupleService: CoupleService) {}

  @Get(':coupleId/anniversary')
  @UseGuards(AuthGuard('jwt'), CoupleAuthGuard)
  @ApiBearerAuth()
  @getCoupleAnniversariesDocs.operation
  @getCoupleAnniversariesDocs.param
  @getCoupleAnniversariesDocs.response
  async getCoupleAnniversaries(@Param('coupleId') coupleId: number) {
    return await this.coupleService.getCoupleAnniversaries(coupleId);
  }

  @Post(':coupleId/anniversaries')
  @UseGuards(AuthGuard('jwt'), CoupleAuthGuard)
  @ApiBearerAuth()
  @addAnniversaryDocs.operation
  @addAnniversaryDocs.param
  @addAnniversaryDocs.body
  @addAnniversaryDocs.response
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

  @Put(':coupleId/anniversaries')
  @UseGuards(AuthGuard('jwt'), CoupleAuthGuard)
  @ApiBearerAuth()
  @updateAnniversaryDocs.operation
  @updateAnniversaryDocs.param
  @updateAnniversaryDocs.body
  @updateAnniversaryDocs.response
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

  @Delete(':coupleId/anniversaries')
  @UseGuards(AuthGuard('jwt'), CoupleAuthGuard)
  @ApiBearerAuth()
  @deleteAnniversaryDocs.operation
  @deleteAnniversaryDocs.param
  @deleteAnniversaryDocs.body
  @deleteAnniversaryDocs.response
  async deleteAnniversary(
    @CurrentUserId() userId: number,
    @Param('coupleId') coupleId: number,
    @Body('id') id: number,
  ) {
    return await this.coupleService.deleteAnniversary(userId, coupleId, id);
  }

  @Post(':coupleId/anniversary')
  @UseGuards(AuthGuard('jwt'), CoupleAuthGuard)
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

  @Get(':coupleId/widget')
  @UseGuards(AuthGuard('jwt'), CoupleAuthGuard)
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
  @UseGuards(AuthGuard('jwt'), CoupleAuthGuard)
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
  @UseGuards(AuthGuard('jwt'), CoupleAuthGuard)
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
