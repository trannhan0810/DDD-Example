import { PersonInMemoryRepository } from './respositories/in-memory-person.repository';
import { InMemoryUnitOfWork } from './unit-of-work';

import { Global, Module } from '@nestjs/common';

const repositories = [
  /* ================== */
  PersonInMemoryRepository,
];

@Global()
@Module({
  providers: [
    /* PROVIDER */
    ...repositories.map(repo => ({ useClass: repo, provide: repo.providerFor })),
    InMemoryUnitOfWork,
  ],
  exports: [
    /* EXPORT */
    ...repositories.map(repo => repo.providerFor),
    InMemoryUnitOfWork,
  ],
})
export class InMemoryDatabaseModule {}
