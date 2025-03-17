import { BaseInMemoryRepository } from './base.repository';

import { User } from '@domain/user-management/entities/user.entity';
import { FilterUserInput, UserRepository } from '@domain/user-management/respositories/user.repository';
import { Injectable } from '@nestjs/common';

const mockUserData = [
  {
    id: 1,
    firstname: 'Mae',
    lastname: 'Chapman',
    email: 'ruz@koevi.ck',
    hashedPassword: '538c4ccc-72a6-5058-865b-894c81d78464',
  },
  {
    id: 2,
    firstname: 'Evan',
    lastname: 'Lopez',
    email: 'fufwe@udamo.yt',
    hashedPassword: '4cadc238-4d7b-5eb0-875f-00ff66026fd3',
  },
  {
    id: 3,
    firstname: 'Rosa',
    lastname: 'McKinney',
    email: 'nit@hampuwka.eu',
    hashedPassword: '0c8dc7f5-7eb6-50a6-b68f-0ecfd1784dcb',
  },
  {
    id: 4,
    firstname: 'Lee',
    lastname: 'Hines',
    email: 'erehe@ek.lu',
    hashedPassword: 'ecfa45bb-5699-5376-b064-7552bc54e3ae',
  },
  {
    id: 5,
    firstname: 'Rena',
    lastname: 'Young',
    email: 'wirome@co.sr',
    hashedPassword: '7cc887b2-90be-59ed-94ef-a4d89f25d814',
  },
];

@Injectable()
export class UserInMemoryRepository extends BaseInMemoryRepository<User> implements UserRepository {
  protected _items: User[] = mockUserData.map(u => User.create(u));
  protected _userAndRoleIds: Map<Id, Id[]> = new Map();

  static readonly providerFor = UserRepository;

  createSpec(filter: Partial<FilterUserInput>) {
    return {
      isSastifyBy: (item: User) => {
        void item;
        void filter;
        return true;
      },
    };
  }

  async findAllMatched(filter: Partial<FilterUserInput>): Promise<User[]> {
    const spec = this.createSpec(filter);
    return this._items.filter(spec.isSastifyBy);
  }
  async findOneMatched(filter: Partial<FilterUserInput>): Promise<User | undefined> {
    const spec = this.createSpec(filter);
    return this._items.find(spec.isSastifyBy);
  }
  async countMatched(filter: Partial<FilterUserInput>): Promise<number> {
    const spec = this.createSpec(filter);
    return this._items.filter(spec.isSastifyBy).length;
  }

  async save(input: User<Id | null>): Promise<Id> {
    const item = input.id ? await this.findById(input.id) : undefined;
    if (item) {
      Object.assign(item, input);
      return item.id;
    }
    const id = Math.max(...this._items.map(item => Number(item.id)));
    this._items.push(User.create({ ...input, id }));
    return id;
  }

  async addRoles(userId: Id, roleIds: Id[]): Promise<void> {
    const existRoleIds = this._userAndRoleIds.get(userId) ?? [];
    const newRoleIds = [...new Set([...existRoleIds, ...roleIds])];
    this._userAndRoleIds.set(userId, newRoleIds);
  }

  async removeRoles(userId: Id, roleIds: Id[]): Promise<void> {
    const existRoleIds = this._userAndRoleIds.get(userId) ?? [];
    const newRoleIds = existRoleIds.filter(id => !roleIds.includes(id));
    this._userAndRoleIds.set(userId, newRoleIds);
  }
}
