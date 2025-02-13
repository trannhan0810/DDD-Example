import { CheckRoomAvailableService } from './check-available.service';

import { TimeRange } from '@domain/base/value-objects/time-range.value-object';

import type { BookingRepository } from '../repositories/booking.repository';

describe('CheckRoomAvailableService', () => {
  let service: CheckRoomAvailableService;
  const bookingRepository = { countMatched: jest.fn() } as unknown as BookingRepository;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new CheckRoomAvailableService(bookingRepository);
  });

  it('should return true if there are no overlapping bookings', async () => {
    jest.spyOn(bookingRepository, 'countMatched').mockResolvedValueOnce(0);

    const result = await service.check({
      roomId: 'room-123',
      period: new TimeRange({ start: new Date('2024-07-04'), end: new Date('2024-07-06') }),
    });

    expect(result).toBe(false);
  });

  it('should return true if there is an overlapping booking', async () => {
    jest.spyOn(bookingRepository, 'countMatched').mockResolvedValueOnce(1);

    const result = await service.check({
      roomId: 'room-123',
      period: new TimeRange({ start: new Date('2024-07-04'), end: new Date('2024-07-06') }),
    });

    expect(result).toBe(true);
  });

  it('should not count the current booking as a conflict', async () => {
    jest.spyOn(bookingRepository, 'countMatched').mockResolvedValueOnce(0);

    const result = await service.check({
      roomId: 'room-123',
      period: new TimeRange({ start: new Date('2024-07-04'), end: new Date('2024-07-06') }),
      bookingId: 'existing-booking-id',
    });

    expect(result).toBe(false);
  });
});
