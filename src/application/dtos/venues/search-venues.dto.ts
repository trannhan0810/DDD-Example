import type { SearchCordinateInput } from '@application/dtos/base/cordinate-input.dto';
import type { DateRangeInput } from '@application/dtos/base/date-range-input.dto';
import type { NumberMatcher } from '@domain/base/base.matcher';

export type SearchVenueInput = {
  location: SearchCordinateInput;
  isAvaiable: DateRangeInput;
  priceRange: NumberMatcher;
  capacity: NumberMatcher;
  area: NumberMatcher;
};
