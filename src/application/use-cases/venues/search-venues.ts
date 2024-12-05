import { SearchVenueInput } from '../../dtos/venues/search-venues.dto';

import { Venue } from '@domain/space-management/venue/venue.entity';
import { VenueRepository } from '@domain/space-management/venue/venue.repository';
import { VenueSpecificationFactory } from '@domain/space-management/venue/venue.specification';

export class SearchVenueUseCase {
  constructor(
    private readonly venueSpecFactory: VenueSpecificationFactory,
    private readonly venueRepository: VenueRepository,
  ) {}

  async process(input: SearchVenueInput): Promise<Venue[]> {
    const { startTime, endTime } = input.isAvaiable;

    const isNearSpec = this.venueSpecFactory.isNear(input.location.cordinate, input.location.range);
    const isAreaMatchedSpec = this.venueSpecFactory.isAreaMatched(input.area);
    const isCapacityMatchedSpec = this.venueSpecFactory.isCapacityMatched(input.capacity);
    const isHavingBookingAtTimeSpec = this.venueSpecFactory.isBookedAt(startTime, endTime);

    const isSastifySearchInput = isNearSpec
      .and(isAreaMatchedSpec, isCapacityMatchedSpec)
      .andNot(isHavingBookingAtTimeSpec);

    return this.venueRepository.findAllMatched(isSastifySearchInput);
  }
}
