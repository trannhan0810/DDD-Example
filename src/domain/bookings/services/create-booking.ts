import { DomainError } from '@domain/base/base.error';
import { Booking } from '@domain/bookings/entities/booking.entity';
import { generateRandomString } from 'src/shared/utils/random.util';

import type { TimeRange } from '@domain/base/value-objects/time-range.value-object';
import type { CheckRoomAvailableService } from '@domain/bookings/services/check-available';

export class CreateBookingService {
  constructor(private readonly checkRoomAvailableService: CheckRoomAvailableService) {}

  async createBooking(roomId: string, period: TimeRange, customerId: string) {
    const isAvailable = await this.checkRoomAvailableService.check({ period, roomId });

    if (!isAvailable) {
      throw new DomainError('Room not available!');
    }

    const bookingCode = this.generateBookingCode();

    return Booking.create({
      code: bookingCode,
      roomId,
      period,
      customerId,
    });
  }

  private generateBookingCode() {
    return generateRandomString({ length: 12 });
  }
}
