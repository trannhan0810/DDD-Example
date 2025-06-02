import { BaseInMemoryRepository } from './base.repository';
import { mockPersonData } from '../data/person.data';

import { Person } from '@domain/person-management/entities/person.entity';
import { FilterPersonInput, PersonRepository } from '@domain/person-management/repositories/person.repository';
import { isSastifyFilter } from '@domain/shared/common/base.filter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PersonInMemoryRepository extends BaseInMemoryRepository<Person> implements PersonRepository {
  protected _items: Person[] = mockPersonData.map(u => Person.create(u));
  protected _personAndRoleIds: Map<Id, Id[]> = new Map();

  static readonly providerFor = PersonRepository;

  createSpec(filter: Partial<FilterPersonInput>) {
    const filterMap: Record<keyof FilterPersonInput, (item: Person) => boolean> = {
      firstname: item => isSastifyFilter(item.firstname, filter.firstname),
      lastname: item => isSastifyFilter(item.lastname, filter.lastname),
      email: item => isSastifyFilter(item.email, filter.email),
      hashedPassword: item => isSastifyFilter(item.hashedPassword, filter.hashedPassword),
      id: item => isSastifyFilter(item.id, filter.id),
      isEmailVerified: item => isSastifyFilter(item.isEmailVerified, filter.isEmailVerified),
      resetPasswordCode: item => isSastifyFilter(item.resetPasswordCode, filter.resetPasswordCode),
      resetPasswordCodeExpireTime: item =>
        isSastifyFilter(item.resetPasswordCodeExpireTime, filter.resetPasswordCodeExpireTime),
    };
    return { isSastifyBy: (item: Person) => Object.values(filterMap).every(checkSastify => checkSastify(item)) };
  }

  async findAllMatched(filter: Partial<FilterPersonInput>): Promise<Person[]> {
    const spec = this.createSpec(filter);
    return this._items.filter(spec.isSastifyBy);
  }
  async findOneMatched(filter: Partial<FilterPersonInput>): Promise<Person | undefined> {
    const spec = this.createSpec(filter);
    return this._items.find(spec.isSastifyBy);
  }
  async countMatched(filter: Partial<FilterPersonInput>): Promise<number> {
    const spec = this.createSpec(filter);
    return this._items.filter(spec.isSastifyBy).length;
  }

  async save(input: Person<Id | null>): Promise<Id> {
    const item = input.id ? await this.findById(input.id) : undefined;
    if (item) {
      Object.assign(item, input);
      return item.id;
    }
    const id = Math.max(...this._items.map(item => Number(item.id)));
    this._items.push(Person.create({ ...input, id }));
    return id;
  }

  async addRoles(personId: Id, roleIds: Id[]): Promise<void> {
    const existRoleIds = this._personAndRoleIds.get(personId) ?? [];
    const newRoleIds = [...new Set([...existRoleIds, ...roleIds])];
    this._personAndRoleIds.set(personId, newRoleIds);
  }

  async removeRoles(personId: Id, roleIds: Id[]): Promise<void> {
    const existRoleIds = this._personAndRoleIds.get(personId) ?? [];
    const newRoleIds = existRoleIds.filter(id => !roleIds.includes(id));
    this._personAndRoleIds.set(personId, newRoleIds);
  }
}
