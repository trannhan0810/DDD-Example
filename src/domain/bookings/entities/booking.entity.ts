import { TimeRange } from '@domain/base/value-objects/time-range.value-object';

import type { UnsavedEntity } from '@domain/base/base.entity';

export enum BOOKING_STATUS {
  Unconfirmed = 'Unconfirmed',
  Confirmed = 'Confirmed',
  CheckedIn = 'Checked-In',
  CheckedOut = 'Checked-Out',
  Completed = 'Completed',
  Canceled = 'Canceled',
}

export enum BOOKING_PAYMENT_STATUS {
  Unpaid = 'Unpaid',
  PartialPaid = 'PartialPaid',
  Paid = 'Paid',
}

export class BaseBooking {
  constructor(
    public readonly id: Id,
    public readonly code: string,
    public customerId: Id,
    public roomId: Id,
    public period: TimeRange,
    public status: BOOKING_STATUS,
    public paymentStatus: BOOKING_PAYMENT_STATUS,
    public totalPrice: number,
  ) {}
}

export class Booking extends BaseBooking {
  isConfirmable(): boolean {
    if (this.status !== BOOKING_STATUS.Unconfirmed) return false;
    if (this.paymentStatus === BOOKING_PAYMENT_STATUS.Unpaid) return false;
    return true;
  }

  isCancellable(): boolean {
    const afterCheckInStatus = [BOOKING_STATUS.CheckedIn, BOOKING_STATUS.CheckedOut, BOOKING_STATUS.Completed];
    const isUnpaid = this.paymentStatus === BOOKING_PAYMENT_STATUS.Unpaid;
    return afterCheckInStatus.includes(this.status) && isUnpaid;
  }

  confirm(): void {
    this.status = BOOKING_STATUS.Confirmed;
  }

  checkIn(): void {
    this.status = BOOKING_STATUS.CheckedIn;
  }

  checkOut(): void {
    this.status = BOOKING_STATUS.CheckedIn;
  }

  cancel(): void {
    this.status = BOOKING_STATUS.Canceled;
  }

  static create<T extends BookingCreate>(input: T): T extends Booking ? Booking : UnsavedEntity<Booking> {
    return new Booking(
      input.id ?? 0,
      input.code ?? '#######',
      input.customerId,
      input.roomId,
      new TimeRange(input.period),
      input.status ?? BOOKING_STATUS.Unconfirmed,
      input.paymentStatus ?? BOOKING_PAYMENT_STATUS.Unpaid,
      input.totalPrice ?? 0,
    );
  }
}

export type BookingCreate = Partial<BaseBooking> & Pick<BaseBooking, 'period' | 'customerId' | 'roomId'>;
