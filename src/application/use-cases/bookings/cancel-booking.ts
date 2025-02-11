import { DomainError } from '@domain/base/base.error';
import { BookingRepository } from '@domain/bookings/repositories/booking.repository';

export type CancelBookingInput = {
  bookingId: Id;
};

export class CreateBookingUseCase {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async process(input: CancelBookingInput): Promise<void> {
    const booking = await this.bookingRepository.findById(input.bookingId);

    if (!booking) throw new DomainError('Booking not found!');
    if (!booking.isCancellable()) throw new DomainError('Booking is not cancelable!');
    booking.cancel();

    await this.bookingRepository.save(booking);
  }
}
