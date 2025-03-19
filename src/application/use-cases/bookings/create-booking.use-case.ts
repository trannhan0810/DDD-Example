import { CreateBookingInput } from '@application/dtos/booking/create-booking.dto';
import { DomainError } from '@domain/base/base.error';
import { Booking } from '@domain/bookings/entities/booking.entity';
import { BookingRepository } from '@domain/bookings/repositories/booking.repository';
import { CheckRoomAvailableService } from '@domain/bookings/services/check-available.service';
import { RoomRepository } from '@domain/property/repositories/room.repository';
import { TimeRange } from '@domain/shared/value-objects/time-range.value-object';
import { generateRandomString } from 'src/shared/utils/random.util';

export class CreateBookingUseCase {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly roomRepository: RoomRepository,
    private readonly chkRoomAvaiableService: CheckRoomAvailableService,
  ) {}

  async process(input: CreateBookingInput): Promise<void> {
    const room = await this.roomRepository.findById(input.roomId);
    if (!room) throw new DomainError('Room not found!');

    await this.chkRoomAvaiableService.validateRoomAvaiable(input);
    const bookingCode = this.generateBookingCode();

    const booking = Booking.create({
      code: bookingCode,
      period: new TimeRange(input.period),
      roomId: input.roomId,
      customerId: input.customerId,
    });
    await this.bookingRepository.save(booking);
  }

  private generateBookingCode() {
    return generateRandomString({ length: 12 });
  }
}
