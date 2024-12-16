import { DomainError } from '@domain/base/base.error';
import { BookingSpecificationFactory } from '@domain/booking-management/booking/booking.specification';
import { BOOKING_CONFIRM_STATUS } from '@domain/booking-management/entities/booking.entity';
import { BookingRepository } from '@domain/booking-management/repositories/booking.repository';

export type CancelBookingInput = {
  bookingId: Id;
};

export class CreateBookingUseCase {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly bookingSpecFactory: BookingSpecificationFactory,
  ) {}

  async process(input: CancelBookingInput): Promise<void> {
    const booking = await this.bookingRepository.findById(input.bookingId);

    if (!booking) throw new DomainError('Booking not found!');
    const isBookingCancelable = this.bookingSpecFactory.isCancelable();
    if (!isBookingCancelable.isSastifyBy(booking)) throw new DomainError('Booking is not cancelable!');

    booking.status = BOOKING_CONFIRM_STATUS.Canceled;
    return void (await this.bookingRepository.save(booking));
  }
}
