import type { BaseEntity } from './base.entity';

export interface Factory<T extends BaseEntity> {
  create(input: unknown): T;
  merge(item: T, input: unknown): T;
}

export abstract class BaseRepository<T extends BaseEntity> {
  abstract findAll(): Promise<T[]>;
  abstract findById(id: Id): Promise<T | undefined>;
  abstract save(item: NullPartial<T>): Promise<Id>;
  abstract deleteById(id: Id): Promise<void>;
}
