import { DomainError } from '@domain/base/base.error';
import { BookingRepository } from '@domain/booking-reservation/repositories/booking.repository';
import { CheckVenueAvailableService } from '@domain/booking-reservation/services/check-available';
import { VenueRepository } from '@domain/space-management/repositories/venue.repository';

export type ConfirmBookingInput = {
  bookingId: Id;
};

export class ConfirmBookingUseCase {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly venueRepository: VenueRepository,
    private readonly chkAvailableService: CheckVenueAvailableService,
  ) {}

  async process(input: ConfirmBookingInput): Promise<void> {
    const booking = await this.bookingRepository.findById(input.bookingId);
    if (!booking) throw new DomainError('Booking not found!');
    const { period, venueId } = booking;

    const [venue] = await this.venueRepository.findWithBookings({ id: { isIn: [venueId] } });
    if (!venue) throw new DomainError('Venue not found!');

    const isAvailable = await this.chkAvailableService.check({ period, venueId });
    if (!isAvailable) throw new DomainError('Venue not available!');

    if (!booking.isConfirmable()) throw new DomainError('Booking is not confirmable!');

    booking.confirm();
    return void (await this.bookingRepository.save(booking));
  }
}
