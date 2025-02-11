import { DomainError } from '@domain/base/base.error';
import { BookingRepository } from '@domain/bookings/repositories/booking.repository';
import { UpdateBookingService } from '@domain/bookings/services/update-booking';
import { RoomRepository } from '@domain/property/repositories/room.repository';

export type ConfirmBookingInput = {
  bookingId: Id;
};

export class ConfirmBookingUseCase {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly roomRepository: RoomRepository,
    private readonly updateBookingService: UpdateBookingService,
  ) {}

  async process(input: ConfirmBookingInput): Promise<void> {
    const booking = await this.bookingRepository.findById(input.bookingId);
    if (!booking) throw new DomainError('Booking not found!');

    const room = await this.roomRepository.findById(booking.roomId);
    if (!room) throw new DomainError('Room not found!');

    const confirmedBooking = await this.updateBookingService.confirmBooking(booking);
    await this.bookingRepository.save(confirmedBooking);
  }
}
