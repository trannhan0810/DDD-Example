import { UpdateBookingInput } from '@application/dtos/booking/update-booking.dto';
import { DomainError } from '@domain/base/base.error';
import { TimeRange } from '@domain/shared/value-objects/time-range.value-object';
import { BookingRepository } from '@domain/bookings/repositories/booking.repository';
import { CheckRoomAvailableService } from '@domain/bookings/services/check-available.service';

export class UpdateBookingUseCase {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly chkRoomAvaiableService: CheckRoomAvailableService,
  ) {}

  async process(input: UpdateBookingInput) {
    const booking = await this.bookingRepository.findById(input.bookingId);
    if (!booking) throw new DomainError('Booking not found!');

    if (input.customerId) {
      booking.customerId = input.customerId;
    }

    if (input.duration || input.roomId) {
      booking.period = new TimeRange(input.duration ?? booking.period);
      booking.roomId = input.roomId ?? booking.roomId;
      await this.chkRoomAvaiableService.validateRoomAvaiable({
        period: booking.period,
        roomId: booking.roomId,
        bookingId: booking.id,
      });
    }

    await this.bookingRepository.save(booking);
  }
}
