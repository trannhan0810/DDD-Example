import { UpdateBookingInput } from '@application/dtos/booking/update-booking.dto';
import { DomainError } from '@domain/base/base.error';
import { BookingRepository } from '@domain/bookings/repositories/booking.repository';
import { UpdateBookingService } from '@domain/bookings/services/update-booking';

export class UpdateBookingUseCase {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly updateBookingService: UpdateBookingService,
  ) {}

  async process(input: UpdateBookingInput) {
    const booking = await this.bookingRepository.findById(input.bookingId);
    if (!booking) throw new DomainError('Booking not found!');

    if (input.customerId) {
      booking.customerId = input.customerId;
    }

    if (input.duration || input.roomId) {
      await this.updateBookingService.updateTimeAndRoom(booking, input.duration, input.roomId);
    }

    await this.bookingRepository.save(booking);
  }
}
