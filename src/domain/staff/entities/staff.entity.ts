import { BaseEntity } from '@domain/shared/common/base.entity';

export class Staff<ID extends Id | null = Id> extends BaseEntity<ID> {
  constructor(
    public readonly id: ID,

    public readonly personId: Id,
    public readonly hotelId: Id,
    public readonly roleIds: Id[],
  ) {
    super();
  }
}
