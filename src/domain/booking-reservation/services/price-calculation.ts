import { DomainError } from '@domain/base/base.error';

import type { BookingRateConfig } from '../entities/booking-rate-config.entity';
import type { Booking } from '../entities/booking.entity';
import type { TimeRange } from '@domain/base/value-objects/time-range.value-object';

export class CalculateBookingPriceService {
  getSuitableBookingRate(period: TimeRange, bookingRateConfigs: BookingRateConfig[]) {
    const countBookingDays = period.countDay();
    const sortedBookingRateConfigs = [...bookingRateConfigs].sort((item1, item2) => {
      if (item1.applyForMinUnit !== item2.applyForMinUnit) return item1.applyForMinUnit - item2.applyForMinUnit;
      if (item1.applyForMinDuration !== item2.applyForMinDuration)
        return item1.applyForMinDuration - item2.applyForMinDuration;
      return -(item1.baseRate - item2.baseRate);
    });
    return sortedBookingRateConfigs.find(item => countBookingDays >= item.applyForMinUnit);
  }

  async calculate(input: { booking: Booking; bookingRateConfigs: BookingRateConfig[] }) {
    const { booking, bookingRateConfigs } = input;
    const bookingRateConfig = this.getSuitableBookingRate(booking.period, bookingRateConfigs);
    if (!bookingRateConfig) {
      throw new DomainError('Cannot calculate booking price: no avaible booking rate config');
    }

    const basePrice = bookingRateConfig.baseRate * booking.period.countDay();

    return {
      price: basePrice,
    };
  }
}
