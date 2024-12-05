import { EntityId } from '@domain/base/base.entity';
import { DomainError } from '@domain/base/base.error';
import { Booking } from '@domain/booking-management/booking/booking.entity';
import { BookingFactory } from '@domain/booking-management/booking/booking.factory';
import { BookingRepository } from '@domain/booking-management/booking/booking.repository';
import { VenueRepository } from '@domain/space-management/venue/venue.repository';
import { VenueSpecificationFactory } from '@domain/space-management/venue/venue.specification';

export type CreateBookingInput = {
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

  async process(input: CreateBookingInput): Promise<void> {
    const { customerId, duration, venueId } = input;
    const { startTime, endTime } = duration;

    const isIDMatchedSpec = this.venueSpecFactory.isIDMatched(venueId);
    const isHavingBookingAtTime = this.venueSpecFactory.isBookedAt(startTime, endTime);
    const [venue] = await this.venueRepository.findWithBookings(isIDMatchedSpec);
    if (!venue) throw new DomainError('Venue not found!');
    if (isHavingBookingAtTime.isSastifyBy(venue)) throw new DomainError('Venue not available!');

    const newBooking: Omit<Booking, 'id'> = BookingFactory.create({
      code: this.generateBookingCode(),
      venueId,
      startTime,
      endTime,
      customerId,
    });
    return void (await this.bookingRepository.save(newBooking));
  }

  private generateBookingCode() {
    return '';
  }
}
