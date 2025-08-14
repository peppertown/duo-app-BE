import { Module, Global } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CoupleRepository } from './couple.repository';

@Global()
@Module({
  providers: [UserRepository, CoupleRepository],
  exports: [UserRepository, CoupleRepository],
})
export class RepositoriesModule {}