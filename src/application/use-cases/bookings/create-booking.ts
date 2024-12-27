import { CreateBookingInput } from '@application/dtos/booking/create-booking.dto';
import { DomainError } from '@domain/base/base.error';
import { TimeRange } from '@domain/base/value-objects/time-range.value-object';
import { Booking } from '@domain/booking-management/entities/booking.entity';
import { BookingRepository } from '@domain/booking-management/repositories/booking.repository';
import { CheckVenueAvailableService } from '@domain/booking-management/services/check-available';
import { VenueRepository } from '@domain/space-management/repositories/venue.repository';

export class CreateBookingUseCase {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly venueRepository: VenueRepository,
    private readonly chkAvailableService: CheckVenueAvailableService,
  ) {}

  async process(input: CreateBookingInput): Promise<void> {
    const { customerId, duration, venueId } = input;
    const [venue] = await this.venueRepository.findWithBookings({ id: { isIn: [venueId] } });

    const period = new TimeRange(duration);
    if (!venue) throw new DomainError('Venue not found!');

    const isAvailable = await this.chkAvailableService.check({ period, venueId });
    if (!isAvailable) throw new DomainError('Venue not available!');

    const newBooking = Booking.create({
      code: this.generateBookingCode(),
      venueId,
      period,
      customerId,
    });
    return void (await this.bookingRepository.save(newBooking));
  }

  private generateBookingCode() {
    return '';
  }
}
