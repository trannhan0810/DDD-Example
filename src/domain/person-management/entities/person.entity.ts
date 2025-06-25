import { BaseEntity } from '@domain/shared/common/base.entity';
import { DomainError } from '@domain/shared/common/base.error';
import { DateTimeUtils } from 'src/shared/utils/date-time.util';
import { generateRandomString } from 'src/shared/utils/random.util';

export class Person<ID extends Id | null = Id> extends BaseEntity<ID> {
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

  forgotPassword() {
    const newResetPassword = generateRandomString({ length: 6, includeNumbers: true });
    const newExpireDate = DateTimeUtils.fromDate(new Date()).add({ hours: 1 }).toDate();
    this.resetPasswordCode = newResetPassword;
    this.resetPasswordCodeExpireTime = newExpireDate;

    return { code: newResetPassword, expireDate: newExpireDate };
  }

  resetPassword(code: string, newHashedPassword: string, curentTime = new Date()) {
    if (!this.resetPasswordCode) throw new DomainError('No reset password infomation!');
    if (!this.resetPasswordCodeExpireTime) throw new DomainError('No reset password infomation!');
    if (this.resetPasswordCode !== code) throw new DomainError('Reset code invalid!');
    if (this.resetPasswordCodeExpireTime.getTime() < curentTime.getTime()) throw new DomainError('Reset code expired!');

    this.hashedPassword = newHashedPassword;
  }

  static create(input: PersonCreate & { id: Id }): Person;
  static create(input: PersonCreate): Person<null>;
  static create(input: PersonCreate): Person<Id | null> {
    return new Person(
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

export type PersonCreate = Partial<Person> & Pick<Person, 'firstname' | 'lastname' | 'email' | 'hashedPassword'>;
