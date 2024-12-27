import type { Venue, VenueWithBookings } from '../entities/venue.entity';
import type { IdFilter, NumberFilter } from '@domain/base/base.filter';
import type { BaseRepository } from '@domain/base/base.repository';
import type { GeoCoordinate } from '@domain/base/value-objects/geo-cordinate.value-object';
import type { TimeRange } from '@domain/base/value-objects/time-range.value-object';

export type FilterVenueInput = {
  id: IdFilter;
  priceRange: NumberFilter;
  capacity: NumberFilter;
  area: NumberFilter;

  location: GeoCoordinate;
  isAvaiableAt: TimeRange;
};

export abstract class VenueRepository implements BaseRepository<Venue> {
  abstract findAll(): Promise<Venue[]>;
  abstract findById(id: Id): Promise<Venue | undefined>;
  abstract findAllMatched(spec: Partial<FilterVenueInput>): Promise<Venue[]>;
  abstract findOneMatched(spec: Partial<FilterVenueInput>): Promise<Venue | undefined>;
  abstract countMatched(spec: Partial<FilterVenueInput>): Promise<number>;

  abstract findWithBookings(spec: Partial<FilterVenueInput>): Promise<VenueWithBookings[]>;

  abstract save(location: Venue): Promise<void>;
  abstract delete(location: Venue): Promise<void>;
}
