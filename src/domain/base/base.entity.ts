export abstract class BaseEntity {
  abstract id: Id;

  constructor() {
    this.validate();
  }

  validate() {
    return true;
  }
}

export interface AuditableEntity extends BaseEntity {
  createdById: Id;
  updatedById: Id;
  createdAt: Date;
  updatedAt: Date;
}

export type UnsavedEntity<T extends BaseEntity> = Omit<T, 'id'>;
export type OptionalID<T extends BaseEntity> = Omit<T, 'id'> & { id?: Maybe<Id> };
