import { Module, Global } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Global()
@Module({
  providers: [UserRepository],
  exports: [UserRepository],
})
export class RepositoriesModule {}