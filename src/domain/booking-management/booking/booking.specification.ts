import type { BaseSpecification } from '@domain/base/base.specification';
import type { Booking } from './booking.entity';
import type { EntityId } from '@domain/base/base.entity';

export abstract class BookingSpecificationFactory {
  abstract isConfirmed(): BaseSpecification<Booking>;
  abstract isCanceled(): BaseSpecification<Booking>;
  abstract isPaid(): BaseSpecification<Booking>;
  abstract isPartialPaid(): BaseSpecification<Booking>;
  abstract isBookedOnVenue(venueId: EntityId): BaseSpecification<Booking>;
}
