import { Module, Global } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CoupleRepository } from './couple.repository';
import { ListRepository } from './list.repository';

@Global()
@Module({
  providers: [UserRepository, CoupleRepository, ListRepository],
  exports: [UserRepository, CoupleRepository, ListRepository],
})
export class RepositoriesModule {}