import type { User } from '../entities/user.entity';
import type { OptionalID } from '@domain/base/base.entity';
import type { BooleanFilter, DateFilter, IdFilter, StringFilter } from '@domain/base/base.filter';
import type { BaseRepository, EditableRepository } from '@domain/base/base.repository';

export type FilterUserInput = {
  id: IdFilter;
  email: StringFilter;

  firstname: StringFilter;
  lastname: StringFilter;
  hashedPassword: StringFilter;

  isEmailVerified: BooleanFilter;
  resetPasswordCode: StringFilter;
  resetPasswordCodeExpireTime: DateFilter;
};

export abstract class UserRepository implements BaseRepository<User>, EditableRepository<User> {
  abstract findAll(): Promise<User[]>;
  abstract findById(userId: Id): Promise<User | undefined>;
  abstract findAllMatched(spec: Partial<FilterUserInput>): Promise<User[]>;
  abstract findOneMatched(spec: Partial<FilterUserInput>): Promise<User | undefined>;
  abstract countMatched(spec: Partial<FilterUserInput>): Promise<number>;

  abstract save(user: OptionalID<User>): Promise<Id>;
  abstract deleteById(id: Id): Promise<void>;

  abstract addRoles(userId: Id, roleIds: Id[]): Promise<void>;
  abstract removeRoles(userId: Id, roleIds: Id[]): Promise<void>;
}
