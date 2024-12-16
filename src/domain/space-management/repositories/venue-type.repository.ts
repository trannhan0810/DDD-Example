import type { VenueType } from '../entities/venue-type.entity';
import type { BaseRepository } from '@domain/base/base.repository';
import type { ISpecification } from '@domain/base/base.specification';

export abstract class VenueTypeRepository implements BaseRepository<VenueType> {
  abstract findAll(): Promise<VenueType[]>;
  abstract findById(id: Id): Promise<VenueType>;
  abstract findAllMatched(spec: ISpecification<VenueType>): Promise<VenueType[]>;
  abstract findOneMatched(spec: ISpecification<VenueType>): Promise<VenueType | undefined>;
  abstract countMatched(spec: ISpecification<VenueType>): Promise<number>;

  abstract save(location: VenueType): Promise<void>;
  abstract delete(location: VenueType): Promise<void>;
}
