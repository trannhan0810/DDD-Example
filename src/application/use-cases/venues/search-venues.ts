import { SearchVenueInput } from '../../dtos/venues/search-venues.dto';

import { GeoCoordinate } from '@domain/base/value-objects/geo-cordinate.value-object';
import { TimeRange } from '@domain/base/value-objects/time-range.value-object';
import { Venue } from '@domain/space-management/entities/venue.entity';
import { VenueRepository } from '@domain/space-management/repositories/venue.repository';

export class SearchVenueUseCase {
  constructor(private readonly venueRepository: VenueRepository) {}

  async process(input: SearchVenueInput): Promise<Venue[]> {
    const { start: start, end: end } = input.isAvaiable;

    return this.venueRepository.findAllMatched({
      location: new GeoCoordinate(input.location.cordinate),
      area: input.area,
      capacity: input.capacity,
      isAvaiableAt: new TimeRange({ start, end }),
    });
  }
}
