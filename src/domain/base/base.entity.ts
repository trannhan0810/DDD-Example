export type EntityId = number | string;

export interface BaseEntity {
  id: EntityId;
}

export type OptionalID<T extends BaseEntity> = Omit<T, 'id'> & { id?: Maybe<EntityId> };
