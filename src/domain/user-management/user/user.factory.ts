import type { User } from './user.entity';
import type { OptionalID } from '@domain/base/base.entity';

export type CreateUserInput = Pick<User, 'firstname' | 'lastname' | 'email' | 'hashedPassword'> & Partial<User>;
export type UpdateUserInput = Partial<Omit<User, 'id' | 'email'>>;

export class UserFactory {
  static create(input: CreateUserInput): User {
    const user: OptionalID<User> = {
      id: input.id ?? null,
      email: input.email,
      firstname: input.firstname,
      lastname: input.lastname,
      hashedPassword: input.hashedPassword,
      isEmailVerified: input.isEmailVerified ?? false,
      resetPasswordCode: input.resetPasswordCode ?? null,
      resetPasswordCodeExpireTime: input.resetPasswordCodeExpireTime ?? null,
    };
    return user as User;
  }
  static merge(user: User, input: UpdateUserInput): User {
    return Object.assign(user, {
      firstname: input.firstname,
      lastname: input.lastname,
      hashedPassword: input.hashedPassword,
      isEmailVerified: input.isEmailVerified ?? false,
      resetPasswordCode: input.resetPasswordCode ?? null,
      resetPasswordCodeExpireTime: input.resetPasswordCodeExpireTime ?? null,
    });
  }
}
