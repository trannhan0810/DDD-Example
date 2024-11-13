export type EntityId = number | string;

export interface BaseEntity {
  id: EntityId;
}

export interface AuditableEntity extends BaseEntity {
  createdById: EntityId;
  updatedById: EntityId;
  createdAt: Date;
  updatedAt: Date;
}

export type OptionalID<T extends BaseEntity> = Omit<T, 'id'> & { id?: Maybe<EntityId> };
