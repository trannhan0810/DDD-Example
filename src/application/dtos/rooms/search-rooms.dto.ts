import type { SearchCordinateInput } from '@application/dtos/shared/cordinate-input.dto';
import type { TimeRangeInput } from '@application/dtos/shared/date-range-input.dto';
import type { NumberFilter } from '@domain/shared/common/base.filter';

export type SearchRoomInput = {
  location: SearchCordinateInput;
  isAvaiable: TimeRangeInput;
  priceRange: NumberFilter;
  capacity: NumberFilter;
  area: NumberFilter;
};
