import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class InMemoryUnitOfWork {
  async start(): Promise<void> {
    return void 'start';
  }
  async commit(): Promise<void> {
    return void 'commit';
  }

  async rollback(): Promise<void> {
    return void 'rollback';
  }
}
