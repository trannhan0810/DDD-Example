import { BookingRepository } from '@domain/bookings/repositories/booking.repository';
import { DomainError } from '@domain/shared/common/base.error';

export type CancelBookingInput = {
  bookingId: Id;
};

export class CreateBookingUseCase {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async process(input: CancelBookingInput): Promise<void> {
    const booking = await this.bookingRepository.findById(input.bookingId);
    if (!booking) throw new DomainError('Booking not found!');

    if (!booking.isCancellable()) throw new DomainError('Booking is not confirmable!');
    booking.cancel();

    await this.bookingRepository.save(booking);
  }
}
