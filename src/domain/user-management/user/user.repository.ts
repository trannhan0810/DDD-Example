import type { User } from '../entities/user.entity';
import type { OptionalID } from '@domain/base/base.entity';
import type { BaseRepository, EditableRepository } from '@domain/base/base.repository';
import type { ISpecification } from '@domain/base/base.specification';

export abstract class UserRepository implements BaseRepository<User>, EditableRepository<User> {
  abstract findAll(): Promise<User[]>;
  abstract findById(userId: Id): Promise<User | undefined>;
  abstract findAllMatched(spec: ISpecification<User>): Promise<User[]>;
  abstract findOneMatched(spec: ISpecification<User>): Promise<User | undefined>;
  abstract countMatched(spec: ISpecification<User>): Promise<number>;

  abstract save(user: OptionalID<User>): Promise<Id>;
  abstract deleteById(id: Id): Promise<void>;

  abstract addRoles(userId: Id, roleIds: Id[]): Promise<void>;
  abstract removeRoles(userId: Id, roleIds: Id[]): Promise<void>;
}
