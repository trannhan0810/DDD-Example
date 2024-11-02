import type { EntityId } from '@domain/base/base.entity';
import { DomainError } from '@domain/base/base.error';
import type { Booking } from '@domain/booking-management/booking/booking.entity';
import type { BookingRepository } from '@domain/booking-management/booking/booking.repository';
import type { VenueRepository } from '@domain/space-management/venue/venue.repository';
import type { VenueSpecificationFactory } from '@domain/space-management/venue/venue.specification';

export type FindAvailableVenueInput = {
  bookingId: EntityId;
};

export class CreateBookingUseCase {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly venueSpecFactory: VenueSpecificationFactory,
    private readonly venueRepository: VenueRepository,
  ) {}

  async process(input: FindAvailableVenueInput): Promise<void> {
    const booking = await this.bookingRepository.findById(input.bookingId);
    if (!booking) throw new DomainError('Booking not found!');
    const { startTime, endTime, venueId } = booking;

    const isIDMatchedSpec = this.venueSpecFactory.isIDMatched(venueId);
    const isVenueBooked = this.venueSpecFactory.isBookedAt(startTime, endTime, booking.id);

    const [venue] = await this.venueRepository.findWithBookings(isIDMatchedSpec);
    if (!venue) throw new DomainError('Venue not found!');
    if (isHavingBookingAtTime.isSastifyBy(venue)) throw new DomainError('Venue not available!');

    return void (await this.bookingRepository.save(booking));
  }

  private generateBookingCode() {
    return '';
  }
}
