import { CalculateBookingPriceService } from './price-calculation.service';
import { RateType } from '../entities/booking-rate-config.entity';

import { DomainError } from '@domain/base/base.error';
import { WeekDays } from 'src/shared/utils/date-time.util';

import type { BookingRateConfigForPriceCalculation } from './price-calculation.service';

describe('CalculateBookingPriceService', () => {
  it('should throw error if end date is before start date', () => {
    const startDateTime = new Date('2024-01-02T10:00:00.000Z');
    const endDateTime = new Date('2024-01-01T10:00:00.000Z');
    const bookingRateConfig: BookingRateConfigForPriceCalculation = {
      id: '1',
      rateType: RateType.Hourly,
      baseRate: 10,
      requiredMinDurationByRateType: 1,
      additionalFeeWeekend: 0,
      weeklyOffDays: [],
    };

    expect(() =>
      CalculateBookingPriceService.calculateBookingPrice(startDateTime, endDateTime, bookingRateConfig),
    ).toThrow(DomainError);
  });

  it('should throw error if duration is less than required minimum (Hourly)', () => {
    const startDateTime = new Date('2024-01-01T10:00:00.000Z');
    const endDateTime = new Date('2024-01-01T10:30:00.000Z');
    const bookingRateConfig: BookingRateConfigForPriceCalculation = {
      id: '1',
      rateType: RateType.Hourly,
      baseRate: 10,
      requiredMinDurationByRateType: 1,
      additionalFeeWeekend: 0,
      weeklyOffDays: [],
    };
    expect(() =>
      CalculateBookingPriceService.calculateBookingPrice(startDateTime, endDateTime, bookingRateConfig),
    ).toThrow();
  });

  it('should throw error if duration is less than required minimum (Daily)', () => {
    const startDateTime = new Date('2024-01-01T10:00:00.000Z');
    const endDateTime = new Date('2024-01-01T10:30:00.000Z');
    const bookingRateConfig: BookingRateConfigForPriceCalculation = {
      id: '1',
      rateType: RateType.Daily,
      baseRate: 10,
      requiredMinDurationByRateType: 1,
      additionalFeeWeekend: 0,
      weeklyOffDays: [],
    };
    expect(() =>
      CalculateBookingPriceService.calculateBookingPrice(startDateTime, endDateTime, bookingRateConfig),
    ).toThrow();
  });

  it('should calculate price correctly for hourly rate', () => {
    const startDateTime = new Date('2024-01-01T10:00:00.000Z');
    const endDateTime = new Date('2024-01-01T12:00:00.000Z');
    const bookingRateConfig: BookingRateConfigForPriceCalculation = {
      id: '1',
      rateType: RateType.Hourly,
      baseRate: 10,
      requiredMinDurationByRateType: 1,
      additionalFeeWeekend: 0,
      weeklyOffDays: [],
    };
    const price = CalculateBookingPriceService.calculateBookingPrice(startDateTime, endDateTime, bookingRateConfig);
    expect(price).toBe(20);
  });

  it('should calculate price correctly for daily rate (no weekend/off days)', () => {
    const startDateTime = new Date('2024-01-01T10:00:00.000Z');
    const endDateTime = new Date('2024-01-03T10:00:00.000Z');
    const bookingRateConfig: BookingRateConfigForPriceCalculation = {
      id: '1',
      rateType: RateType.Daily,
      baseRate: 100,
      requiredMinDurationByRateType: 1,
      additionalFeeWeekend: 0,
      weeklyOffDays: [],
    };
    const price = CalculateBookingPriceService.calculateBookingPrice(startDateTime, endDateTime, bookingRateConfig);
    expect(price).toBe(200);
  });

  it('should calculate price correctly for daily rate (with weekend)', () => {
    const startDateTime = new Date('2024-01-05T10:00:00.000Z'); // Friday
    const endDateTime = new Date('2024-01-08T10:00:00.000Z'); // Monday
    const bookingRateConfig: BookingRateConfigForPriceCalculation = {
      id: '1',
      rateType: RateType.Daily,
      baseRate: 100,
      requiredMinDurationByRateType: 1,
      additionalFeeWeekend: 50,
      weeklyOffDays: [],
    };
    const price = CalculateBookingPriceService.calculateBookingPrice(startDateTime, endDateTime, bookingRateConfig);
    expect(price).toBe(400); // 3 days * 100 + 1 weekend day * 50
  });

  it('should calculate price correctly for daily rate (with off days)', () => {
    const startDateTime = new Date('2024-01-01T10:00:00.000Z'); // Monday
    const endDateTime = new Date('2024-01-04T10:00:00.000Z'); // Thursday
    const bookingRateConfig: BookingRateConfigForPriceCalculation = {
      id: '1',
      rateType: RateType.Daily,
      baseRate: 100,
      requiredMinDurationByRateType: 1,
      additionalFeeWeekend: 0,
      weeklyOffDays: [WeekDays.Wednesday],
    };
    const price = CalculateBookingPriceService.calculateBookingPrice(startDateTime, endDateTime, bookingRateConfig);
    expect(price).toBe(200); // 3 days * 100 - 1 off day * 100
  });

  it('should calculate price correctly for daily rate (with weekend and off days)', () => {
    const startDateTime = new Date('2024-01-05T10:00:00.000Z'); // Friday
    const endDateTime = new Date('2024-01-09T10:00:00.000Z'); // Tuesday
    const bookingRateConfig: BookingRateConfigForPriceCalculation = {
      id: '1',
      rateType: RateType.Daily,
      baseRate: 100,
      requiredMinDurationByRateType: 1,
      additionalFeeWeekend: 50,
      weeklyOffDays: [WeekDays.Monday],
    };
    const price = CalculateBookingPriceService.calculateBookingPrice(startDateTime, endDateTime, bookingRateConfig);
    expect(price).toBe(400); // 4 days * 100 + 2 weekend day * 50 - 1 off day * 100
  });
});
