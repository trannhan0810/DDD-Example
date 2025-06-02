import { CheckRoomAvailableService } from './check-available.service';

import { DomainError } from '@domain/shared/common/base.error';

import type { BookingRepository } from '../repositories/booking.repository';

describe('CheckRoomAvailableService', () => {
  const bookingRepository = { countMatched: jest.fn() };
  let checkRoomAvailableService: CheckRoomAvailableService;

  beforeEach(() => {
    jest.resetAllMocks();
    checkRoomAvailableService = new CheckRoomAvailableService(bookingRepository as unknown as BookingRepository);
  });

  describe('check', () => {
    it('should return isAvailable: false and countConflictBooking when there are conflicting bookings', async () => {
      const input = {
        roomId: 'room1',
        period: { start: new Date(), end: new Date() },
      };
      bookingRepository.countMatched.mockResolvedValue(1);

      const result = await checkRoomAvailableService.check(input);

      expect(result).toEqual({ isAvailable: false, countConflictBooking: 1 });
      expect(bookingRepository.countMatched).toHaveBeenCalledWith({
        roomId: { $in: ['room1'] },
        overlapWithPeriod: input.period,
        id: undefined,
      });
    });

    it('should return isAvailable: true and countConflictBooking when there are no conflicting bookings', async () => {
      const input = {
        roomId: 'room1',
        period: { start: new Date(), end: new Date() },
      };
      bookingRepository.countMatched.mockResolvedValue(0);

      const result = await checkRoomAvailableService.check(input);

      expect(result).toEqual({ isAvailable: true, countConflictBooking: 0 });
      expect(bookingRepository.countMatched).toHaveBeenCalledWith({
        roomId: { $in: ['room1'] },
        overlapWithPeriod: input.period,
        id: undefined,
      });
    });

    it('should exclude the bookingId when provided', async () => {
      const input = {
        roomId: 'room1',
        period: { start: new Date(), end: new Date() },
        bookingId: 'booking123',
      };
      bookingRepository.countMatched.mockResolvedValue(0);

      await checkRoomAvailableService.check(input);

      expect(bookingRepository.countMatched).toHaveBeenCalledWith({
        roomId: { $in: ['room1'] },
        id: { $nin: ['booking123'] },
        overlapWithPeriod: input.period,
      });
    });
  });

  describe('validateRoomAvaiable', () => {
    it('should not throw an error if the room is available', async () => {
      const input = {
        roomId: 'room1',
        period: { start: new Date(), end: new Date() },
      };
      bookingRepository.countMatched.mockResolvedValue(0); // Room is available

      await expect(checkRoomAvailableService.validateRoomAvaiable(input)).resolves.not.toThrow();
    });

    it('should throw a DomainError if the room is not available', async () => {
      const input = {
        roomId: 'room1',
        period: { start: new Date(), end: new Date() },
      };
      bookingRepository.countMatched.mockResolvedValue(1); // Room is not available

      await expect(checkRoomAvailableService.validateRoomAvaiable(input)).rejects.toThrow(DomainError);
      await expect(checkRoomAvailableService.validateRoomAvaiable(input)).rejects.toThrow('Room not available!');
    });
  });
});
