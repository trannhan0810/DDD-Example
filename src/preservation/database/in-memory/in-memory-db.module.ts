import { Global, Module } from '@nestjs/common';

import { InMemoryUserRepository } from './respositories/in-memory-user.repository';

const repositories = [
  /* ================== */
  InMemoryUserRepository,
];

@Global()
@Module({
  imports: [],
  providers: repositories.map(repo => ({
    useClass: repo,
    provide: repo.providerFor,
  })),
  exports: repositories.map(repo => repo.providerFor),
})
export class InMemoryDatabaseModule {}
