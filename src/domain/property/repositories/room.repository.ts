import { BaseRepository } from '@domain/base/base.repository';

import type { Room, RoomIncludeBookingProjection } from '../entities/room.entity';
import type { IdFilter, NumberFilter } from '@domain/base/base.filter';
import type { GeoCoordinate } from '@domain/base/value-objects/geo-cordinate.value-object';
import type { TimeRange } from '@domain/base/value-objects/time-range.value-object';

export type FilterRoomInput = {
  id: IdFilter;
  priceRange: NumberFilter;
  capacity: NumberFilter;
  area: NumberFilter;

  location: GeoCoordinate;
  isAvaiableAt: TimeRange;
};

export abstract class RoomRepository extends BaseRepository<Room> {
  abstract findAllMatched(spec: Partial<FilterRoomInput>): Promise<Room[]>;
  abstract findOneMatched(spec: Partial<FilterRoomInput>): Promise<Room | undefined>;
  abstract countMatched(spec: Partial<FilterRoomInput>): Promise<number>;

  abstract findWithBookings(spec: Partial<FilterRoomInput>): Promise<RoomIncludeBookingProjection[]>;

  abstract save(input: Room): Promise<Id>;
  abstract delete(id: Id): Promise<void>;
}
