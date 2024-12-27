import type { SearchCordinateInput } from '@application/dtos/base/cordinate-input.dto';
import type { TimeRangeInput } from '@application/dtos/base/date-range-input.dto';
import type { NumberFilter } from '@domain/base/base.filter';

export type SearchVenueInput = {
  location: SearchCordinateInput;
  isAvaiable: TimeRangeInput;
  priceRange: NumberFilter;
  capacity: NumberFilter;
  area: NumberFilter;
};
