import { CreateBookingInput } from '@application/dtos/booking/create-booking.dto';
import { DomainError } from '@domain/base/base.error';
import { TimeRange } from '@domain/base/value-objects/time-range.value-object';
import { BookingRepository } from '@domain/bookings/repositories/booking.repository';
import { CreateBookingService } from '@domain/bookings/services/create-booking';
import { RoomRepository } from '@domain/property/repositories/room.repository';

export class CreateBookingUseCase {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly roomRepository: RoomRepository,
    private readonly createBookingService: CreateBookingService,
  ) {}

  async process(input: CreateBookingInput): Promise<void> {
    const { customerId, duration, roomId } = input;
    const period = new TimeRange(duration);

    const room = await this.roomRepository.findById(roomId);
    if (!room) throw new DomainError('Room not found!');

    const booking = await this.createBookingService.createBooking(roomId, period, customerId);
    await this.bookingRepository.save(booking);
  }
}
