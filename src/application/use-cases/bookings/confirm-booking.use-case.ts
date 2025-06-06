import { BookingRepository } from '@domain/bookings/repositories/booking.repository';
import { DomainError } from '@domain/shared/common/base.error';

export type ConfirmBookingInput = {
  bookingId: Id;
};

export class ConfirmBookingUseCase {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async process(input: ConfirmBookingInput): Promise<void> {
    const booking = await this.bookingRepository.findById(input.bookingId);
    if (!booking) throw new DomainError('Booking not found!');

    if (!booking.isConfirmable()) throw new DomainError('Booking is not confirmable!');
    booking.confirm();

    await this.bookingRepository.save(booking);
  }
}
