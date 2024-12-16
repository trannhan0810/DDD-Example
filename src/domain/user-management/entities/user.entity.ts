import { BaseEntity } from '@domain/base/base.entity';

import type { UnsavedEntity } from '@domain/base/base.entity';

export class User extends BaseEntity {
  constructor(
    public readonly id: Id,
    public readonly email: string,
    public firstname: string,
    public lastname: string,
    public hashedPassword: string,

    public isEmailVerified: boolean,
    public resetPasswordCode: Nullable<string>,
    public resetPasswordCodeExpireTime: Nullable<Date>,
  ) {
    super();
  }

  static create<T extends UserCreate>(input: UserCreate): T extends User ? User : UnsavedEntity<User> {
    return new User(
      input.id ?? 0,
      input.email,
      input.firstname,
      input.lastname,
      input.hashedPassword,
      input.isEmailVerified ?? false,
      input.resetPasswordCode ?? null,
      input.resetPasswordCodeExpireTime ?? null,
    );
  }
}

export type UserCreate = Partial<User> & Pick<User, 'firstname' | 'lastname' | 'email' | 'hashedPassword'>;
