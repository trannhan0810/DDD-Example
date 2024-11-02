import type { Booking } from './booking.entity';

export type CreateBookingInput = Pick<User, 'firstname' | 'lastname' | 'email' | 'hashedPassword'> & Partial<User>;
export type UpdateUserInput = Partial<Omit<User, 'id' | 'email'>>;

export class BookingFactory {
  static create(input: CreateBookingInput): Booking {
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
s;
