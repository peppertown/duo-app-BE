import { Module, Global } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CoupleRepository } from './couple.repository';
import { ListRepository } from './list.repository';
import { MemoRepository } from './memo.repository';
import { TodoRepository } from './todo.repository';

@Global()
@Module({
  providers: [UserRepository, CoupleRepository, ListRepository, MemoRepository, TodoRepository],
  exports: [UserRepository, CoupleRepository, ListRepository, MemoRepository, TodoRepository],
})
export class RepositoriesModule {}