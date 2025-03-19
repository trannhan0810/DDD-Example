import { BaseEntity } from '@domain/shared/common/base.entity';

import type { Privilege } from './privilege.entity';

export class Role<ID extends Id | null = Id> extends BaseEntity<ID> {
  constructor(
    public readonly id: ID,
    public readonly name: string,

    public readonly privileges: Privilege[],
  ) {
    super();
  }
}
