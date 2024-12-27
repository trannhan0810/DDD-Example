import { BaseEntity } from '@domain/base/base.entity';
import { DomainError } from '@domain/base/base.error';

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

  updateResetPassword() {
    const newResetPassword = '123456';
    const newExpireDate = new Date();
    this.resetPasswordCode = newResetPassword;
    this.resetPasswordCodeExpireTime = newExpireDate;

    return { code: newResetPassword, expireDate: newExpireDate };
  }

  verifyResetCode(code: string) {
    if (!this.resetPasswordCode) throw new DomainError('No reset password infomation!');
    if (!this.resetPasswordCodeExpireTime) throw new DomainError('No reset password infomation!');
    if (this.resetPasswordCode !== code) throw new DomainError('Reset code invalid!');
    if (this.resetPasswordCodeExpireTime.getTime() < Date.now()) throw new DomainError('Reset code expired!');
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
