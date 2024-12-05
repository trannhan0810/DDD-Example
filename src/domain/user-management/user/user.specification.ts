import { BaseSpecification } from '@domain/base/base.specification';

import type { User } from '../entities/user.entity';

export class UserEmailMatchedSpec extends BaseSpecification<User> {
  constructor(public readonly email: string) {
    super();
  }
  isSastifyBy(item: User): boolean {
    return item.email === this.email;
  }
}

export class UserEmailVerifiedSpec extends BaseSpecification<User> {
  isSastifyBy(item: User): boolean {
    return item.email.includes('@');
  }
}

export class UserPasswordMatchedSpec extends BaseSpecification<User> {
  constructor(public readonly hashedPassword: string) {
    super();
  }
  isSastifyBy(item: User): boolean {
    return item.hashedPassword === this.hashedPassword;
  }
}

export class ResetCodeValidSpec extends BaseSpecification<User> {
  constructor(public readonly code: string) {
    super();
  }
  isSastifyBy(item: User): boolean {
    const { resetPasswordCodeExpireTime, resetPasswordCode } = item;
    return (
      !!resetPasswordCodeExpireTime &&
      !!resetPasswordCode &&
      resetPasswordCode === this.code &&
      resetPasswordCodeExpireTime.getTime() < Date.now()
    );
  }
}
