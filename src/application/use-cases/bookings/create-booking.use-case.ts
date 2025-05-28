import { CreateBookingInput } from '@application/dtos/booking/create-booking.dto';
import { BOOKING_STATUS, Booking } from '@domain/bookings/entities/booking.entity';
import { BookingRepository } from '@domain/bookings/repositories/booking.repository';
import { CheckRoomAvailableService } from '@domain/bookings/services/check-available.service';
import { DomainError } from '@domain/shared/common/base.error';
import { TimeRange } from '@domain/shared/value-objects/time-range.value-object';
import { generateRandomString } from 'src/shared/utils/random.util';

export class CreateBookingUseCase {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly chkRoomAvaiableService: CheckRoomAvailableService,
  ) {}

  async process(input: CreateBookingInput): Promise<void> {
    const booking = Booking.create({
      code: this.generateBookingCode(),
      period: new TimeRange(input.period),
      roomId: input.roomId,
      customerId: input.customerId,
      status: BOOKING_STATUS.Unconfirmed,
    });

    if (input.status === BOOKING_STATUS.Confirmed) {
      await this.chkRoomAvaiableService.validateRoomAvaiable(input);
      if (!booking.isConfirmable()) {
        throw new DomainError('Booking is not confirmable!');
      }
      booking.confirm();
    }

    await this.bookingRepository.save(booking);
  }

  generateBookingCode() {
    return generateRandomString({ length: 12 });
  }
}
