import type { Booking } from './booking.entity';
import type { EntityId } from '@domain/base/base.entity';
import type { BaseSpecification } from '@domain/base/base.specification';

export abstract class BookingSpecificationFactory {
  abstract isConfirmable(): BaseSpecification<Booking>;
  abstract isCancelable(): BaseSpecification<Booking>;
  abstract isPaid(): BaseSpecification<Booking>;
  abstract isPartialPaid(): BaseSpecification<Booking>;
  abstract isBookedOnVenue(venueId: EntityId): BaseSpecification<Booking>;
}
