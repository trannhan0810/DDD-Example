import type { BaseEntity, EntityId } from '@domain/base/base.entity';
import type { BaseRepository, EditableRepository } from '@domain/base/base.repository';
import type { ISpecification } from '@domain/base/base.specification';

export abstract class InMemoryBaseRepository<T extends BaseEntity> implements BaseRepository<T> {
  protected abstract _items: T[];
  async findAll() {
    return [...this._items];
  }
  async findById(id: EntityId): Promise<T | undefined> {
    return this._items.find(item => item.id === id);
  }
  async findAllMatched(spec: ISpecification<T>): Promise<T[]> {
    return this._items.filter(spec.isSastifyBy);
  }
  async findOneMatched(spec: ISpecification<T>): Promise<T | undefined> {
    return this._items.find(spec.isSastifyBy);
  }
  async countMatched(spec: ISpecification<T>): Promise<number> {
    return this._items.filter(spec.isSastifyBy).length;
  }
}

export abstract class InMemoryEditableRespository<T extends BaseEntity>
  extends InMemoryBaseRepository<T>
  implements EditableRepository<T>
{
  abstract save(item: NullPartial<T>): Promise<EntityId>;

  async deleteById(id: EntityId): Promise<void> {
    const index = this._items.findIndex(item => item.id === id);
    if (index > -1) this._items.splice(index, 1);
  }
}
