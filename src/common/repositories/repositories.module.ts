import { Module, Global } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CoupleRepository } from './couple.repository';
import { CoupleAnniversaryRepository } from './couple-anniversary.repository';
import { WidgetRepository } from './widget.repository';

@Global()
@Module({
  providers: [
    UserRepository,
    CoupleRepository,
    CoupleAnniversaryRepository,
    WidgetRepository,
  ],
  exports: [
    UserRepository,
    CoupleRepository,
    CoupleAnniversaryRepository,
    WidgetRepository,
  ],
})
export class RepositoriesModule {}