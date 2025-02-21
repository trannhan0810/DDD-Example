import { BaseEntity } from '@domain/base/base.entity';

export class RoomType<ID extends Id | null = Id> extends BaseEntity<ID> {
  constructor(
    //
    public readonly id: ID,
    public readonly name: string,
    public readonly description: string,
  ) {
    super();
  }
}
