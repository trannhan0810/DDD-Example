import { EntityId } from '@domain/base/base.entity';
import { DomainError } from '@domain/base/base.error';
import { BOOKING_CONFIRM_STATUS } from '@domain/booking-management/booking/booking.entity';
import { BookingRepository } from '@domain/booking-management/booking/booking.repository';
import { BookingSpecificationFactory } from '@domain/booking-management/booking/booking.specification';
import { VenueRepository } from '@domain/space-management/venue/venue.repository';
import { VenueSpecificationFactory } from '@domain/space-management/venue/venue.specification';

export type ConfirmBookingInput = {
  bookingId: EntityId;
};

export class ConfirmBookingUseCase {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly bookingSpecFactory: BookingSpecificationFactory,
    private readonly venueSpecFactory: VenueSpecificationFactory,
    private readonly venueRepository: VenueRepository,
  ) {}

  async process(input: ConfirmBookingInput): Promise<void> {
    const booking = await this.bookingRepository.findById(input.bookingId);
    if (!booking) throw new DomainError('Booking not found!');
    const { startTime, endTime, venueId } = booking;

    const isIDMatchedSpec = this.venueSpecFactory.isIDMatched(venueId);
    const isVenueBooked = this.venueSpecFactory.isBookedAt(startTime, endTime, booking.id);
    const isBookingConfirmable = this.bookingSpecFactory.isConfirmable();

    const [venue] = await this.venueRepository.findWithBookings(isIDMatchedSpec);
    if (!venue) throw new DomainError('Venue not found!');
    if (isVenueBooked.isSastifyBy(venue)) throw new DomainError('Venue not available!');
    if (!isBookingConfirmable.isSastifyBy(booking)) throw new DomainError('Booking is not confirmable!');

    booking.status = BOOKING_CONFIRM_STATUS.Confirmed;
    return void (await this.bookingRepository.save(booking));
  }
}
