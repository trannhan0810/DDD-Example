import type { NumberMatcher } from '@domain/base/base.matcher';
import type { Venue } from '@domain/space-management/venue/venue.entity';
import type { VenueRepository } from '@domain/space-management/venue/venue.repository';
import type { VenueSpecificationFactory } from '@domain/space-management/venue/venue.specification';

export type VenueAvaiablityInput = { startTime: Date; endTime: Date };
export type FindVenueLocationInput = { place: { longitude: number; latitude: number }; radius: number };

export type FindVenueInput = {
  geoLocation: FindVenueLocationInput;
  isAvaiable: VenueAvaiablityInput;
  priceRange: NumberMatcher;
  capacity: NumberMatcher;
  area: NumberMatcher;
};

export class FindAllVenueUseCase {
  constructor(
    private readonly venueSpecFactory: VenueSpecificationFactory,
    private readonly venueRepository: VenueRepository,
  ) {}

  async process(input: FindVenueInput): Promise<Venue[]> {
    const { startTime, endTime } = input.isAvaiable;

    const isNearSpec = this.venueSpecFactory.isNear(input.geoLocation.place, input.geoLocation.radius);
    const isAreaMatchedSpec = this.venueSpecFactory.isAreaMatched(input.area);
    const isCapacityMatchedSpec = this.venueSpecFactory.isCapacityMatched(input.capacity);
    const isHavingBookingAtTimeSpec = this.venueSpecFactory.isBookedAt(startTime, endTime);

    const isSastifySearchInput = isNearSpec
      .and(isAreaMatchedSpec, isCapacityMatchedSpec)
      .andNot(isHavingBookingAtTimeSpec);

    return this.venueRepository.findAllMatched(isSastifySearchInput);
  }
}
