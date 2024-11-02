import type { BaseEntity } from '@domain/base/base.entity';
import type { VenueType } from '../venue-type/venue-type.entity';
import type { VenueLocation } from '../venue-location/venue-location.entity';
import type { Booking } from '@domain/booking-management/booking/booking.entity';

export interface Venue extends BaseEntity {
  name: string;
  description: string;
  capacity: number;
  area: number;

  venueLocation: VenueLocation;
  venueType: VenueType;
  amenities: string[];
}

export interface VenueWithBooking extends Venue {
  bookings: Booking[];
}
