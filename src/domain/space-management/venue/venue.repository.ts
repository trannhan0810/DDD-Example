import type { EntityId } from '@domain/base/base.entity';
import type { BaseRepository } from '@domain/base/base.repository';
import type { ISpecification } from '@domain/base/base.specification';
import type { Venue, VenueWithBooking } from './venue.entity';

export abstract class VenueRepository implements BaseRepository<Venue> {
  abstract findAll(q: string): Promise<Venue[]>;
  abstract findById(id: EntityId): Promise<Venue | undefined>;
  abstract findAllMatched(spec: ISpecification<Venue>): Promise<Venue[]>;
  abstract findOneMatched(spec: ISpecification<Venue>): Promise<Venue | undefined>;
  abstract countMatched(spec: ISpecification<Venue>): Promise<number>;

  abstract findWithBookings(spec: ISpecification<VenueWithBooking>): Promise<VenueWithBooking[]>;

  abstract save(location: Venue): Promise<void>;
  abstract delete(location: Venue): Promise<void>;
}
