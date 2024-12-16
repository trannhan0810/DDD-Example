import { BaseEntity } from '@domain/base/base.entity';
import { TimeRange } from '@domain/base/value-objects/time-range.value-object';

import type { UnsavedEntity } from '@domain/base/base.entity';

export enum BOOKING_CONFIRM_STATUS {
  Unconfirmed = 'Unconfirmed',
  Confirmed = 'Confirmed',
  Canceled = 'Canceled',
  Completed = 'Completed',
}

export enum BOOKING_PAYMENT_STATUS {
  Unpaid = 'Unpaid',
  PartialPaid = 'PartialPaid',
  Paid = 'Paid',
}

export class Booking extends BaseEntity {
  constructor(
    public readonly id: Id,
    public readonly code: string,
    public readonly customerId: Id,
    public readonly venueId: Id,
    public period: TimeRange,
    public status: BOOKING_CONFIRM_STATUS,
    public paymentStatus: BOOKING_PAYMENT_STATUS,
    public totalPrice: number,
  ) {
    super();
  }

  static create<T extends BookingCreate>(input: T): T extends Booking ? Booking : UnsavedEntity<Booking> {
    return new Booking(
      input.id ?? 0,
      input.code ?? '#######',
      input.customerId,
      input.venueId,
      new TimeRange(input.period),
      input.status ?? BOOKING_CONFIRM_STATUS.Unconfirmed,
      input.paymentStatus ?? BOOKING_PAYMENT_STATUS.Unpaid,
      input.totalPrice ?? 0,
    );
  }
}

export type BookingCreate = Partial<Booking> & Pick<Booking, 'period' | 'customerId' | 'venueId'>;
