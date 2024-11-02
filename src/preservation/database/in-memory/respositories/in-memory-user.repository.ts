import { Injectable } from '@nestjs/common';
import { InMemoryEditableRespository } from './base.repository';
import { EntityId, OptionalID } from '@domain/base/base.entity';
import { User } from '@domain/user-management/user/user.entity';
import { UserRepository, UserFactory } from '@domain/user-management/user/user.repository';

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
export class InMemoryUserRepository extends InMemoryEditableRespository<User> implements UserRepository {
  public factory = UserFactory;
  protected _items: User[] = mockUserData.map(UserFactory.create);

  static get providerFor() {
    return UserRepository;
  }

  async save(input: OptionalID<User>): Promise<EntityId> {
    const item = input.id ? await this.findById(input.id) : undefined;
    if (item) {
      Object.assign(item, input);
      return item.id;
    }
    const id = Math.max(...this._items.map(item => Number(item.id)));
    this._items.push(UserFactory.create({ ...input, id }));
    return id;
  }
}
