import type { InMemoryUnitOfWork } from '../unit-of-work';
import type { BaseEntity } from '@domain/shared/common/base.entity';
import type { BaseRepository } from '@domain/shared/common/base.repository';

export abstract class BaseInMemoryRepository<T extends BaseEntity> implements BaseRepository<T> {
  protected abstract _items: T[];
  constructor(private uow: InMemoryUnitOfWork) {}

  async findAll() {
    return [...this._items];
  }
  async findById(id: Id): Promise<T | undefined> {
    return this._items.find(item => item.id === id);
  }

  abstract save(item: NullPartial<T>): Promise<Id>;

  async deleteById(id: Id): Promise<void> {
    const index = this._items.findIndex(item => item.id === id);
    if (index > -1) this._items.splice(index, 1);
  }
}
