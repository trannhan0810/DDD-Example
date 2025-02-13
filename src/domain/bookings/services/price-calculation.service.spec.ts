import { CalculateBookingPriceService } from './price-calculation.service';
import { BookingRateTimeUnit } from '../entities/booking-rate-config.entity';

import { DomainError } from '@domain/base/base.error';
import { TimeRange } from '@domain/base/value-objects/time-range.value-object';

import type { BookingRateConfig } from '../entities/booking-rate-config.entity';
import type { Booking } from '../entities/booking.entity';

describe('CalculateBookingPriceService', () => {
  let service: CalculateBookingPriceService;

  beforeEach(() => {
    service = new CalculateBookingPriceService();
  });

  it('should calculate booking price correctly with daily rate', () => {
    const booking: Booking = {
      // ... other Booking properties
      period: new TimeRange({ start: new Date('2024-07-04'), end: new Date('2024-07-06') }),
    } as Booking;

    const bookingRateConfigs: BookingRateConfig[] = [
      {
        applyForMinUnit: BookingRateTimeUnit.Day,
        applyForMinDuration: 0,
        baseRate: 100,
      } as BookingRateConfig,
    ];

    const result = service.calculate({ booking, bookingRateConfigs });

    expect(result).toEqual({ price: 300 });
  });

  it('should calculate booking price correctly with monthly rate', () => {
    const booking: Booking = {
      // ... other Booking properties
      period: new TimeRange({ start: new Date('2024-07-01'), end: new Date('2024-08-01') }),
    } as Booking;

    const bookingRateConfigs: BookingRateConfig[] = [
      {
        applyForMinUnit: BookingRateTimeUnit.Month,
        applyForMinDuration: 0,
        baseRate: 1000,
      } as BookingRateConfig,
    ];

    const result = service.calculate({ booking, bookingRateConfigs });

    expect(result).toEqual({ price: 32000 });
  });

  it('should throw an error if no suitable booking rate config found', () => {
    const booking: Booking = {
      // ... other Booking properties
      period: new TimeRange({ start: new Date('2024-07-04'), end: new Date('2024-07-06') }),
    } as Booking;

    const bookingRateConfigs: BookingRateConfig[] = [
      {
        applyForMinUnit: BookingRateTimeUnit.Month,
        applyForMinDuration: 0,
        baseRate: 1000,
      } as BookingRateConfig,
    ];

    expect(() => service.calculate({ booking, bookingRateConfigs })).toThrow(DomainError);
  });

  // ... other test cases for different scenarios ...
});
