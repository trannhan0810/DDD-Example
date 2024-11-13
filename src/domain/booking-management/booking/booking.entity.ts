import type { BaseEntity, EntityId } from '@domain/base/base.entity';
import type { Venue } from '@domain/space-management/venue/venue.entity';

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

export interface Booking extends BaseEntity {
  code: string;

  venueId: EntityId;
  startTime: Date;
  endTime: Date;
  customerId: EntityId;

  status: BOOKING_CONFIRM_STATUS;
  paymentStatus: BOOKING_PAYMENT_STATUS;
}

export interface BookingWithVenue extends Booking {
  venue: Venue;
}
