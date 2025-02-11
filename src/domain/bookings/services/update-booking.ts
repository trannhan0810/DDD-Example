import { DomainError } from '@domain/base/base.error';
import { TimeRange } from '@domain/base/value-objects/time-range.value-object';

import type { CheckRoomAvailableService } from './check-available';
import type { Booking } from '../entities/booking.entity';

export class UpdateBookingService {
  constructor(private readonly chkAvailableService: CheckRoomAvailableService) {}

  async updateTimeAndRoom(booking: Booking, newPeriod?: ObjectLike<TimeRange>, newRoomId?: string): Promise<void> {
    if (newPeriod || newRoomId) {
      const period = new TimeRange(newPeriod ?? booking.period);
      const isAvailable = await this.chkAvailableService.check({
        period,
        roomId: newRoomId ?? booking.roomId,
        bookingId: booking.id,
      });

      if (!isAvailable) {
        throw new DomainError('Room not available!');
      }

      booking.period = period;
    }
  }

  async confirmBooking(booking: Booking) {
    if (!booking.isConfirmable()) {
      throw new DomainError('Booking is not confirmable!');
    }

    const isAvailable = await this.chkAvailableService.check({
      period: booking.period,
      roomId: booking.roomId,
    });

    if (!isAvailable) {
      throw new DomainError('Room not available!');
    }

    booking.confirm();
    return booking;
  }
}
