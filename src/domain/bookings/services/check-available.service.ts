import { DomainError } from '@domain/shared/common/base.error';

import type { BookingRepository } from '../repositories/booking.repository';
import type { ITimeRange } from '@domain/shared/value-objects/time-range.value-object';

export class CheckRoomAvailableService {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async check(input: { roomId: Id; period: ITimeRange; bookingId?: Id }) {
    const countConflictBooking = await this.bookingRepository.countMatched({
      roomId: { isIn: [input.roomId] },
      id: input.bookingId ? { notIn: [input.bookingId] } : undefined,
      overlapWithPeriod: input.period,
    });

    return {
      isAvailable: countConflictBooking == 0,
      countConflictBooking,
    };
  }

  async validateRoomAvaiable(input: { roomId: Id; period: ITimeRange; bookingId?: Id }): Promise<void> {
    const { isAvailable } = await this.check(input);
    if (!isAvailable) {
      throw new DomainError('Room not available!');
    }
  }
}
