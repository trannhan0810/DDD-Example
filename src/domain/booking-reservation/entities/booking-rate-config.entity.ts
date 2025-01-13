import { BaseEntity } from '@domain/base/base.entity';

import type { Currency } from '@domain/base/value-objects/currency.value-object';

export enum BookingRateTimeUnit {
  Day = 1,
  Month = 28,
  Year = 365,
}

export class BookingRateConfig extends BaseEntity {
  constructor(
    public id: Id,
    public venueId: Id,

    public currency: Currency,
    public baseRate: number,
    public additionalFeeWeekend: number,
    public additionalFeeLateCheckout: number,

    public applyForMinDuration: number,
    public applyForMinUnit: BookingRateTimeUnit,
  ) {
    super();
  }
}
