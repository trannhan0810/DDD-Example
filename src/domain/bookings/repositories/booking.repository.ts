import { BaseRepository } from '@domain/base/base.repository';

import type { BOOKING_PAYMENT_STATUS, BOOKING_STATUS, Booking } from '../entities/booking.entity';
import type { IdFilter, StringFilter } from '@domain/base/base.filter';
import type { TimeRange } from '@domain/base/value-objects/time-range.value-object';

export type FilterBookingInput = {
  id: IdFilter;
  code: StringFilter;
  customerId: IdFilter;
  roomId: IdFilter;
  overlapWithPeriod: ObjectLike<TimeRange>;
  status: BOOKING_STATUS;
  paymentStatus: BOOKING_PAYMENT_STATUS;
};

export abstract class BookingRepository extends BaseRepository<Booking> {
  abstract findAllMatched(filter: Partial<FilterBookingInput>): Promise<Booking[]>;
  abstract findOneMatched(filter: Partial<FilterBookingInput>): Promise<Booking | undefined>;
  abstract countMatched(filter: Partial<FilterBookingInput>): Promise<number>;

  abstract save(input: Booking<Id | null>): Promise<void>;
  abstract delete(id: Id): Promise<void>;
}
