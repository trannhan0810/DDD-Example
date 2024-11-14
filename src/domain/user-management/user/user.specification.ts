import type { User } from './user.entity';
import type { StringMatcher } from '@domain/base/base.matcher';
import type { BaseSpecification } from '@domain/base/base.specification';

type UserSpecification = BaseSpecification<User>;

export abstract class UserSpecificationFactory {
  abstract isEmailMatched(email: string | StringMatcher): UserSpecification;
  abstract isEmailVerified(): UserSpecification;
  abstract isPasswordMatched(password: string): UserSpecification;
  abstract isResetCodeMatched(code: string): UserSpecification;
  abstract isResetCodeExpired(): UserSpecification;
}
