import { Injectable } from '@nestjs/common';
import type { EntityId } from '@domain/base/base.entity';
import type { BaseRepository } from '@domain/base/base.repository';
import type { VenueLocation } from './venue-location.entity';
import type { ISpecification } from '@domain/base/base.specification';

@Injectable()
export abstract class VenueLocationRepository implements BaseRepository<VenueLocation> {
  abstract findAll(): Promise<VenueLocation[]>;
  abstract findById(id: EntityId): Promise<VenueLocation>;
  abstract findAllMatched(spec: ISpecification<VenueLocation>): Promise<VenueLocation[]>;
  abstract findOneMatched(spec: ISpecification<VenueLocation>): Promise<VenueLocation | undefined>;
  abstract countMatched(spec: ISpecification<VenueLocation>): Promise<number>;

  abstract save(location: VenueLocation): Promise<void>;
  abstract delete(location: VenueLocation): Promise<void>;
}
