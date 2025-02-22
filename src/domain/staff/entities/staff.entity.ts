import { BaseEntity } from '@domain/base/base.entity';

import type { Role } from './role.entity';
import type { Hotel } from '@domain/property/entities/hotel.entity';
import type { User } from '@domain/user-management/entities/user.entity';

export class Staff<ID extends Id | null = Id> extends BaseEntity<ID> {
  constructor(
    public readonly id: ID,

    public readonly person: User,
    public readonly hotel: Hotel,
    public readonly roles: Role[],
  ) {
    super();
  }
}
