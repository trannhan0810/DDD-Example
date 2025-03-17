import { BaseEntity } from '@domain/base/base.entity';
import { DomainError } from '@domain/base/base.error';
import { DateTimeUtils } from 'src/shared/utils/date-time.util';
import { generateRandomString } from 'src/shared/utils/random.util';

export class User<ID extends Id | null = Id> extends BaseEntity<ID> {
  constructor(
    public readonly id: ID,
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

  updateResetPasswordCode() {
    const newResetPassword = generateRandomString({ length: 6, includeNumbers: true });
    const newExpireDate = DateTimeUtils.fromDate(new Date()).add({ hour: 1 }).toDate();
    this.resetPasswordCode = newResetPassword;
    this.resetPasswordCodeExpireTime = newExpireDate;

    return { code: newResetPassword, expireDate: newExpireDate };
  }

  verifyResetPasswordCode(code: string) {
    if (!this.resetPasswordCode) throw new DomainError('No reset password infomation!');
    if (!this.resetPasswordCodeExpireTime) throw new DomainError('No reset password infomation!');
    if (this.resetPasswordCode !== code) throw new DomainError('Reset code invalid!');
    if (this.resetPasswordCodeExpireTime.getTime() < Date.now()) throw new DomainError('Reset code expired!');
  }

  static create(input: UserCreate & { id: Id }): User;
  static create(input: UserCreate): User<null>;
  static create(input: UserCreate): User<Id | null> {
    return new User(
      input.id ?? null,
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
