import type { BookingRateConfig } from '../entities/booking-rate-config.entity';
import type { Booking } from '../entities/booking.entity';
import type { IdFilter, StringFilter } from '@domain/base/base.filter';
import type { BaseRepository } from '@domain/base/base.repository';

export type FilterBookingRateConfigInput = {
  id: IdFilter;
  venueId: StringFilter;
};

export abstract class BookingRepository implements BaseRepository<BookingRateConfig> {
  abstract findAll(): Promise<BookingRateConfig[]>;
  abstract findById(id: Id): Promise<BookingRateConfig | undefined>;
  abstract findAllMatched(filter: Partial<FilterBookingRateConfigInput>): Promise<BookingRateConfig[]>;
  abstract findOneMatched(filter: Partial<FilterBookingRateConfigInput>): Promise<BookingRateConfig | undefined>;
  abstract countMatched(filter: Partial<FilterBookingRateConfigInput>): Promise<number>;

  abstract save(booking: Omit<Booking, 'id'>): Promise<void>;
  abstract delete(booking: Booking): Promise<void>;
}
