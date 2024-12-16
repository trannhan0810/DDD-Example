import { DomainError } from '@domain/base/base.error';
import { TimeRange } from '@domain/base/value-objects/time-range.value-object';
import { Booking } from '@domain/booking-management/entities/booking.entity';
import { BookingRepository } from '@domain/booking-management/repositories/booking.repository';
import { CheckVenueAvailableService } from '@domain/booking-management/services/check-available';
import { VenueRepository } from '@domain/space-management/repositories/venue.repository';
import { VenueSpecificationFactory } from '@domain/space-management/venue/venue.specification';

export type CreateBookingInput = {
  duration: { startTime: Date; endTime: Date };
  venueId: Id;
  customerId: Id;
};

export class CreateBookingUseCase {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly venueSpecFactory: VenueSpecificationFactory,
    private readonly venueRepository: VenueRepository,
    private readonly chkAvailableService: CheckVenueAvailableService,
  ) {}

  async process(input: CreateBookingInput): Promise<void> {
    const { customerId, duration, venueId } = input;
    const { startTime, endTime } = duration;

    const isIDMatchedSpec = this.venueSpecFactory.isIDMatched(venueId);
    const [venue] = await this.venueRepository.findWithBookings(isIDMatchedSpec);
    const period = new TimeRange({ start: startTime, end: endTime });
    if (!venue) throw new DomainError('Venue not found!');

    const chkAvail = await this.chkAvailableService.check({ period, venueId });
    if (!chkAvail) throw new DomainError('Venue not available!');

    const newBooking = Booking.create({
      code: this.generateBookingCode(),
      venueId,
      period: { start: startTime, end: endTime },
      customerId,
    });
    return void (await this.bookingRepository.save(newBooking));
  }

  private generateBookingCode() {
    return '';
  }
}
