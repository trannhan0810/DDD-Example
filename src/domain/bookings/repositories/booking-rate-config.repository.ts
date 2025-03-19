import { BaseRepository } from '@domain/shared/common/base.repository';

import type { BookingRateConfig } from '../entities/booking-rate-config.entity';
import type { IdFilter, StringFilter } from '@domain/shared/common/base.filter';

export type FilterBookingRateConfigInput = {
  id: IdFilter;
  roomId: StringFilter;
};

export abstract class BookingRateRepository extends BaseRepository<BookingRateConfig> {
  abstract findAllMatched(filter: Partial<FilterBookingRateConfigInput>): Promise<BookingRateConfig[]>;
  abstract findOneMatched(filter: Partial<FilterBookingRateConfigInput>): Promise<BookingRateConfig | undefined>;
  abstract countMatched(filter: Partial<FilterBookingRateConfigInput>): Promise<number>;

  abstract save(input: BookingRateConfig<Id | null>): Promise<Id>;
  abstract delete(id: Id): Promise<void>;
}
