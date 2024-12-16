import { Injectable } from '@nestjs/common';

import type { VenueLocation } from '../entities/venue-location.entity';
import type { BaseRepository } from '@domain/base/base.repository';
import type { ISpecification } from '@domain/base/base.specification';

@Injectable()
export abstract class VenueLocationRepository implements BaseRepository<VenueLocation> {
  abstract findAll(): Promise<VenueLocation[]>;
  abstract findById(id: Id): Promise<VenueLocation>;
  abstract findAllMatched(spec: ISpecification<VenueLocation>): Promise<VenueLocation[]>;
  abstract findOneMatched(spec: ISpecification<VenueLocation>): Promise<VenueLocation | undefined>;
  abstract countMatched(spec: ISpecification<VenueLocation>): Promise<number>;

  abstract save(location: VenueLocation): Promise<void>;
  abstract delete(location: VenueLocation): Promise<void>;
}
