import { BaseEntity } from '@domain/base/base.entity';
import { TimeRange } from '@domain/shared/value-objects/time-range.value-object';

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

export class BaseBooking<ID extends Id | null = Id> extends BaseEntity<ID> {
  constructor(
    public readonly id: ID,
    public readonly code: string,
    public customerId: Id,
    public roomId: Id,
    public period: TimeRange,
    public status: BOOKING_STATUS,
    public paymentStatus: BOOKING_PAYMENT_STATUS,
    public totalPrice: number,
  ) {
    super();
  }
}

export class Booking<ID extends Id | null = Id> extends BaseBooking<ID> {
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
    this.status = BOOKING_STATUS.CheckedOut;
  }

  cancel(): void {
    this.status = BOOKING_STATUS.Canceled;
  }

  static create(input: BookingCreate & { id: Id }): Booking;
  static create(input: BookingCreate): Booking<null>;
  static create(input: BookingCreate & { id: Id }): Booking<null | Id> {
    return new Booking(
      input.id ?? null,
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
