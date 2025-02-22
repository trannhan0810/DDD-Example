import { RateType } from '../entities/booking-rate-config.entity';

import { DomainError } from '@domain/base/base.error';
import { DateTimeUnit, DateTimeUtils, DurationConverter, WeekDays } from 'src/shared/utils/date-time.util';

import type { BookingRateConfig } from '../entities/booking-rate-config.entity';

export type BookingRateConfigForPriceCalculation = Pick<
  BookingRateConfig,
  'id' | 'rateType' | 'baseRate' | 'requiredMinDurationByRateType' | 'additionalFeeWeekend' | 'weeklyOffDays'
>;

export class CalculateBookingPriceService {
  static calculateBookingPrice(
    startDateTime: Date,
    endDateTime: Date,
    bookingRateConfig: BookingRateConfigForPriceCalculation,
  ): number {
    if (endDateTime <= startDateTime) {
      throw new DomainError('End date/time must be after start date/time');
    }

    const bookTypeDateUnit = bookingRateConfig.rateType === RateType.Hourly ? DateTimeUnit.hour : DateTimeUnit.day;
    const duration = DateTimeUtils.diff(endDateTime, startDateTime);
    const durationByBookingType = new DurationConverter(duration).toDecimal(bookTypeDateUnit);

    const { requiredMinDurationByRateType } = bookingRateConfig;
    if (durationByBookingType < requiredMinDurationByRateType) {
      throw new Error(
        `Booking duration must be at least ${requiredMinDurationByRateType} ${bookingRateConfig.rateType.toLowerCase()}`,
      );
    }

    let totalPrice = durationByBookingType * bookingRateConfig.baseRate;

    if (bookingRateConfig.rateType === RateType.Daily) {
      //Handle weekend
      const weekendDays = DateTimeUtils.countWeekdays(startDateTime, endDateTime, [WeekDays.Saturday, WeekDays.Sunday]);
      totalPrice += weekendDays * bookingRateConfig.additionalFeeWeekend;

      // Handle off days
      const offDayCount = DateTimeUtils.countWeekdays(startDateTime, endDateTime, bookingRateConfig.weeklyOffDays);
      totalPrice -= offDayCount * bookingRateConfig.baseRate;
    }

    return totalPrice;
  }
}
