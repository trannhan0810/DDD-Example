import { BOOKING_CONFIRM_STATUS, BOOKING_PAYMENT_STATUS, type Booking } from './booking.entity';

import type { EntityId, OptionalID } from '@domain/base/base.entity';
import type { User } from '@domain/user-management/user/user.entity';

export type CreateBookingInput = Pick<Booking, 'startTime' | 'endTime' | 'venueId' | 'customerId'> & Partial<Booking>;
export type UpdateUserInput = Partial<Omit<User, 'id' | 'email'>>;

export class BookingFactory {
  static create(input: CreateBookingInput, id: EntityId): Booking;
  static create(input: CreateBookingInput, id?: EntityId): Omit<Booking, 'id'>;
  static create(input: CreateBookingInput, id?: EntityId): Omit<Booking, 'id'> {
    const booking: OptionalID<Booking> = {
      id: id ?? input.id,
      code: input.code ?? 'null',
      venueId: input.venueId,
      startTime: input.startTime,
      endTime: input.endTime,
      customerId: input.customerId,

      status: input.status ?? BOOKING_CONFIRM_STATUS.Unconfirmed,
      paymentStatus: input.paymentStatus ?? BOOKING_PAYMENT_STATUS.Unpaid,
    };
    return booking as Booking;
  }
}
