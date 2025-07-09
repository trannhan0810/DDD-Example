import { UseCase } from 'src/shared/decorators';

import type { Person } from '../entities/person.entity';
import type { BooleanFilter, DateFilter, IdFilter, StringFilter } from '@domain/shared/common/base.filter';
import type { BaseRepository } from '@domain/shared/common/base.repository';

export type FilterPersonInput = {
  id: IdFilter;
  email: StringFilter;

  firstname: StringFilter;
  lastname: StringFilter;
  hashedPassword: StringFilter;

  isEmailVerified: BooleanFilter;
  resetPasswordCode: StringFilter;
  resetPasswordCodeExpireTime: DateFilter;
};

@UseCase()
export abstract class PersonRepository implements BaseRepository<Person> {
  abstract findAll(): Promise<Person[]>;
  abstract findById(personId: Id): Promise<Person | undefined>;
  abstract findAllMatched(spec: Partial<FilterPersonInput>): Promise<Person[]>;
  abstract findOneMatched(spec: Partial<FilterPersonInput>): Promise<Person | undefined>;
  abstract countMatched(spec: Partial<FilterPersonInput>): Promise<number>;

  abstract save(person: Person<Id | null>): Promise<Id>;
  abstract deleteById(id: Id): Promise<void>;

  abstract addRoles(personId: Id, roleIds: Id[]): Promise<void>;
  abstract removeRoles(personId: Id, roleIds: Id[]): Promise<void>;
}
