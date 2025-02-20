import { BaseEntity } from '@domain/base/base.entity';

import type { Currency } from '@domain/base/value-objects/currency.value-object';
import type { WeekDays } from 'src/shared/utils/date-time.util';

export enum RateType {
  Hourly = 'Hourly',
  Daily = 'Daily',
}

export class BookingRateConfig extends BaseEntity {
  constructor(
    public id: Id,
    public roomId: Id,

    public currency: Currency,
    public rateType: RateType,
    public baseRate: number, //Rate by the rateType

    public weeklyOffDays: WeekDays[], // Price will be 0 in offDays
    public additionalFeeWeekend: number, // Only apply for daily rate
    public additionalFeeLateCheckout: number, // Additional amount if checking out late

    public requiredMinDurationByRateType: number = 0,
  ) {
    super();
  }
}
