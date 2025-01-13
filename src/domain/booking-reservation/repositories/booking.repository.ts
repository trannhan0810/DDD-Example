import type { BOOKING_CONFIRM_STATUS, BOOKING_PAYMENT_STATUS, Booking } from '../entities/booking.entity';
import type { IdFilter, StringFilter } from '@domain/base/base.filter';
import type { BaseRepository } from '@domain/base/base.repository';
import type { TimeRange } from '@domain/base/value-objects/time-range.value-object';

export type FilterBookingInput = {
  id: IdFilter;
  code: StringFilter;
  customerId: IdFilter;
  venueId: IdFilter;
  overlapWithPeriod: TimeRange;
  status: BOOKING_CONFIRM_STATUS;
  paymentStatus: BOOKING_PAYMENT_STATUS;
};

export abstract class BookingRepository implements BaseRepository<Booking> {
  abstract findAll(): Promise<Booking[]>;
  abstract findById(id: Id): Promise<Booking | undefined>;
  abstract findAllMatched(filter: Partial<FilterBookingInput>): Promise<Booking[]>;
  abstract findOneMatched(filter: Partial<FilterBookingInput>): Promise<Booking | undefined>;
  abstract countMatched(filter: Partial<FilterBookingInput>): Promise<number>;

  abstract save(booking: Omit<Booking, 'id'>): Promise<void>;
  abstract delete(booking: Booking): Promise<void>;
}
