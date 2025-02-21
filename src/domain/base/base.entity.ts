export abstract class BaseEntity<ID extends Id | null = Id> {
  abstract id: ID;

  hasId(): this is BaseEntity<Id> {
    return this.id !== null;
  }
}

export interface AuditableEntity<ID extends Id | null> extends BaseEntity<ID> {
  createdById: Id;
  updatedById: Id;
  createdAt: Date;
  updatedAt: Date;
}

export type UnsavedEntity<T extends BaseEntity> = Omit<T, 'id'>;
export type OptionalID<T extends BaseEntity> = Omit<T, 'id'> & { id?: Maybe<Id> };
