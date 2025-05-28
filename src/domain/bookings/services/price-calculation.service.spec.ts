import { CalculateBookingPriceService } from './price-calculation.service';
import { RateType } from '../entities/booking-rate-config.entity';

import { DomainError } from '@domain/shared/common/base.error';
import { WeekDays } from 'src/shared/utils/date-time.util';

import type { BookingRateConfigForPriceCalculation } from './price-calculation.service';

const bookingRateConfigFactory = (
  input: Partial<BookingRateConfigForPriceCalculation> = {},
): BookingRateConfigForPriceCalculation => ({
  id: input.id ?? '1',
  rateType: input.rateType ?? RateType.Hourly,
  baseRate: input.baseRate ?? 10,
  requiredMinDurationByRateType: input.requiredMinDurationByRateType ?? 1,
  additionalFeeWeekend: input.additionalFeeWeekend ?? 0,
  weeklyOffDays: input.weeklyOffDays ?? [],
});

describe('CalculateBookingPriceService', () => {
  it('should throw error if end date is before start date', () => {
    const startDateTime = new Date('2024-01-02T10:00:00.000Z');
    const endDateTime = new Date('2024-01-01T10:00:00.000Z');
    const bookingRateConfig = bookingRateConfigFactory();

    expect(() =>
      CalculateBookingPriceService.calculateBookingPrice(startDateTime, endDateTime, bookingRateConfig),
    ).toThrow(new DomainError('End date/time must be after start date/time'));
  });

  it('should throw error if duration is less than required minimum (Hourly)', () => {
    const startDateTime = new Date('2024-01-01T10:00:00.000Z');
    const endDateTime = new Date('2024-01-01T10:30:00.000Z');
    const bookingRateConfig = bookingRateConfigFactory({
      rateType: RateType.Hourly,
      requiredMinDurationByRateType: 1,
    });

    expect(() =>
      CalculateBookingPriceService.calculateBookingPrice(startDateTime, endDateTime, bookingRateConfig),
    ).toThrow();
  });

  it('should throw error if duration is less than required minimum (Daily)', () => {
    const startDateTime = new Date('2024-01-01T10:00:00.000Z');
    const endDateTime = new Date('2024-01-01T10:30:00.000Z');
    const bookingRateConfig = bookingRateConfigFactory({
      rateType: RateType.Daily,
      requiredMinDurationByRateType: 1,
    });
    expect(() =>
      CalculateBookingPriceService.calculateBookingPrice(startDateTime, endDateTime, bookingRateConfig),
    ).toThrow();
  });

  it('should calculate price correctly for hourly rate', () => {
    const startDateTime = new Date('2024-01-01T10:00:00.000Z');
    const endDateTime = new Date('2024-01-01T12:00:00.000Z');
    const bookingRateConfig = bookingRateConfigFactory({
      rateType: RateType.Hourly,
      baseRate: 10,
      requiredMinDurationByRateType: 1,
      additionalFeeWeekend: 0,
      weeklyOffDays: [],
    });
    const price = CalculateBookingPriceService.calculateBookingPrice(startDateTime, endDateTime, bookingRateConfig);
    expect(price).toBe(20);
  });

  it('should calculate price correctly for daily rate (no weekend/off days)', () => {
    const startDateTime = new Date('2024-01-01T10:00:00.000Z');
    const endDateTime = new Date('2024-01-03T10:00:00.000Z');
    const bookingRateConfig = bookingRateConfigFactory({
      rateType: RateType.Daily,
      baseRate: 100,
      requiredMinDurationByRateType: 1,
      additionalFeeWeekend: 0,
      weeklyOffDays: [],
    });
    const price = CalculateBookingPriceService.calculateBookingPrice(startDateTime, endDateTime, bookingRateConfig);
    expect(price).toBe(200);
  });

  it('should calculate price correctly for daily rate (with weekend)', () => {
    const startDateTime = new Date('2024-01-05T10:00:00.000Z'); // Friday
    const endDateTime = new Date('2024-01-08T10:00:00.000Z'); // Monday
    const bookingRateConfig = bookingRateConfigFactory({
      rateType: RateType.Daily,
      baseRate: 100,
      requiredMinDurationByRateType: 1,
      additionalFeeWeekend: 50,
      weeklyOffDays: [],
    });
    const price = CalculateBookingPriceService.calculateBookingPrice(startDateTime, endDateTime, bookingRateConfig);
    expect(price).toBe(400); // 3 days * 100 + 1 weekend day * 50
  });

  it('should calculate price correctly for daily rate (with off days)', () => {
    const startDateTime = new Date('2024-01-01T10:00:00.000Z'); // Monday
    const endDateTime = new Date('2024-01-04T10:00:00.000Z'); // Thursday
    const bookingRateConfig = bookingRateConfigFactory({
      rateType: RateType.Daily,
      baseRate: 100,
      requiredMinDurationByRateType: 1,
      additionalFeeWeekend: 0,
      weeklyOffDays: [WeekDays.Wednesday],
    });
    const price = CalculateBookingPriceService.calculateBookingPrice(startDateTime, endDateTime, bookingRateConfig);
    expect(price).toBe(200); // 3 days * 100 - 1 off day * 100
  });

  it('should calculate price correctly for daily rate (with weekend and off days)', () => {
    const startDateTime = new Date('2024-01-05T10:00:00.000Z'); // Friday
    const endDateTime = new Date('2024-01-09T10:00:00.000Z'); // Tuesday
    const bookingRateConfig = bookingRateConfigFactory({
      rateType: RateType.Daily,
      baseRate: 100,
      requiredMinDurationByRateType: 1,
      additionalFeeWeekend: 50,
      weeklyOffDays: [WeekDays.Monday],
    });
    const price = CalculateBookingPriceService.calculateBookingPrice(startDateTime, endDateTime, bookingRateConfig);
    expect(price).toBe(400); // 4 days * 100 + 2 weekend day * 50 - 1 off day * 100
  });
});
