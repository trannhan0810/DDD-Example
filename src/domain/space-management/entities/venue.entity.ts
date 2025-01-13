import type { VenueLocation } from './venue-location.entity';
import type { VenueType } from './venue-type.entity';
import type { BaseEntity } from '@domain/base/base.entity';
import type { Booking } from '@domain/booking-reservation/entities/booking.entity';

export interface Venue extends BaseEntity {
  name: string;
  description: string;
  capacity: number;
  area: number;

  venueLocation: VenueLocation;
  venueType: VenueType;
  amenities: string[];
}

export interface VenueWithBookings extends Venue {
  bookings: Booking[];
}
