import type { BaseSpecification } from '@domain/base/base.specification';
import type { Venue, VenueWithBookings } from './venue.entity';
import type { GeoLocation } from '../venue-location/venue-location.entity';
import type { NumberMatcher } from '@domain/base/base.matcher';
import type { EntityId } from '@domain/base/base.entity';
import type { Booking } from '@domain/booking-management/booking/booking.entity';

export abstract class VenueSpecificationFactory {
  abstract isIDMatched(id: EntityId): BaseSpecification<Venue>;
  abstract isNear(place: GeoLocation, radius: number): BaseSpecification<Venue>;
  abstract isCapacityMatched(capacity: number | NumberMatcher): BaseSpecification<Venue>;
  abstract isAreaMatched(area: number | NumberMatcher): BaseSpecification<Venue>;

  abstract isHavingBookingMatched(bookingSpec: BaseSpecification<Booking>): BaseSpecification<VenueWithBookings>;
  abstract isBookedAt(startTime: Date, endTime: Date, bookingId?: EntityId): BaseSpecification<VenueWithBookings>;
}
