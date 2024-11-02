import type { EntityId } from '@domain/base/base.entity';
import { DomainError } from '@domain/base/base.error';
import type { Booking } from '@domain/booking-management/booking/booking.entity';
import type { BookingRepository } from '@domain/booking-management/booking/booking.repository';
import type { VenueRepository } from '@domain/space-management/venue/venue.repository';
import type { VenueSpecificationFactory } from '@domain/space-management/venue/venue.specification';

export type FindAvailableVenueInput = {
  duration: { startTime: Date; endTime: Date };
  venueId: EntityId;
  customerId: EntityId;
};

export class CreateBookingUseCase {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly venueSpecFactory: VenueSpecificationFactory,
    private readonly venueRepository: VenueRepository,
  ) {}

  async process(input: FindAvailableVenueInput): Promise<void> {
    const { startTime, endTime } = input.duration;

    const isIDMatchedSpec = this.venueSpecFactory.isIDMatched(input.venueId);
    const isHavingBookingAtTime = this.venueSpecFactory.isBookedAt(startTime, endTime);
    const [venue] = await this.venueRepository.findWithBookings(isIDMatchedSpec);
    if (!venue) throw new DomainError('Venue not found!');
    if (isHavingBookingAtTime.isSastifyBy(venue)) throw new DomainError('Venue not available!');

    const newBooking: Omit<Booking, 'id'> = {
      code: this.generateBookingCode(),
      startTime,
      endTime,
      venueId: venue.id,
    };
    return void (await this.bookingRepository.save(newBooking));
  }

  private generateBookingCode() {
    return '';
  }
}
