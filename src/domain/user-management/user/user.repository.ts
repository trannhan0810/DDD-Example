import { UserFactory } from './user.factory';

import type { User } from './user.entity';
import type { EntityId, OptionalID } from '@domain/base/base.entity';
import type { BaseRepository, EditableRepository } from '@domain/base/base.repository';
import type { ISpecification } from '@domain/base/base.specification';

export abstract class UserRepository implements BaseRepository<User>, EditableRepository<User> {
  public factory = UserFactory;

  abstract findAll(): Promise<User[]>;
  abstract findById(userId: EntityId): Promise<User | undefined>;
  abstract findAllMatched(spec: ISpecification<User>): Promise<User[]>;
  abstract findOneMatched(spec: ISpecification<User>): Promise<User | undefined>;
  abstract countMatched(spec: ISpecification<User>): Promise<number>;

  abstract save(user: OptionalID<User>): Promise<EntityId>;
  abstract deleteById(id: EntityId): Promise<void>;

  abstract addRoles(userId: EntityId, roleIds: EntityId[]): Promise<void>;
  abstract removeRoles(userId: EntityId, roleIds: EntityId[]): Promise<void>;
}
