import type { BookingRepository } from '../repositories/booking.repository';
import type { TimeRange } from '@domain/base/value-objects/time-range.value-object';

export class CheckVenueAvailableService {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async check(input: { venueId: Id; period: TimeRange; bookingId?: Id }) {
    const countConflictBooking = await this.bookingRepository.countMatched({
      venueId: { isIn: [input.venueId] },
      overlapWithPeriod: input.period,
      id: input.bookingId ? { notIn: [input.bookingId] } : undefined,
    });

    return countConflictBooking > 0;
  }
}
