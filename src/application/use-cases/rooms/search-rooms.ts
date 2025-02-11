import { SearchRoomInput } from '../../dtos/rooms/search-rooms.dto';

import { GeoCoordinate } from '@domain/base/value-objects/geo-cordinate.value-object';
import { TimeRange } from '@domain/base/value-objects/time-range.value-object';
import { Room } from '@domain/property/entities/room.entity';
import { RoomRepository } from '@domain/property/repositories/room.repository';

export class SearchRoomUseCase {
  constructor(private readonly roomRepository: RoomRepository) {}

  async process(input: SearchRoomInput): Promise<Room[]> {
    const { start: start, end: end } = input.isAvaiable;

    return this.roomRepository.findAllMatched({
      location: new GeoCoordinate(input.location.cordinate),
      area: input.area,
      capacity: input.capacity,
      isAvaiableAt: new TimeRange({ start, end }),
    });
  }
}
