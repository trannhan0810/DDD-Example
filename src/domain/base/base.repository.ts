import type { BaseEntity, EntityId } from './base.entity';
import type { ISpecification } from './base.specification';

export interface Factory<T extends BaseEntity> {
  create(input: unknown): T;
  merge(item: T, input: unknown): T;
}

export interface BaseRepository<T extends BaseEntity> {
  findAll(q: string): Promise<T[]>;
  findById(id: EntityId): Promise<T | undefined>;
  findAllMatched(spec: ISpecification<T>): Promise<T[]>;
  findOneMatched(spec: ISpecification<T>): Promise<T | undefined>;
  countMatched(spec: ISpecification<T>): Promise<number>;
}

export interface EditableRepository<T extends BaseEntity> {
  save(item: NullPartial<T>): Promise<EntityId>;
  deleteById(id: EntityId): Promise<void>;
}
