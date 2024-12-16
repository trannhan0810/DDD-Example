import type { BaseEntity } from './base.entity';

export interface Factory<T extends BaseEntity> {
  create(input: unknown): T;
  merge(item: T, input: unknown): T;
}

export interface BaseRepository<T extends BaseEntity> {
  findAll(): Promise<T[]>;
  findById(id: Id): Promise<T | undefined>;
}

export interface EditableRepository<T extends BaseEntity> {
  save(item: NullPartial<T>): Promise<Id>;
  deleteById(id: Id): Promise<void>;
}
