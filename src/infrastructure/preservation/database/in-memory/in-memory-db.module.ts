import { UserInMemoryRepository } from './respositories/in-memory-user.repository';

import { Global, Module } from '@nestjs/common';

const repositories = [
  /* ================== */
  UserInMemoryRepository,
];

@Global()
@Module({
  providers: repositories.map(repo => ({ useClass: repo, provide: repo.providerFor })),
  exports: repositories.map(repo => repo.providerFor),
})
export class InMemoryDatabaseModule {}
