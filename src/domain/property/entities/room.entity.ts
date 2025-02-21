import { BaseEntity } from '@domain/base/base.entity';

import type { Hotel } from './hotel.entity';
import type { RoomType } from './room-type.entity';
import type { Booking } from '@domain/bookings/entities/booking.entity';

export class Room<ID extends Id | null = Id> extends BaseEntity<ID> {
  constructor(
    public readonly id: ID,
    public readonly name: string,
    public description: string,
    public capacityPeople: number,
    public area: number,
    public amenities: string[],

    public hotel: Hotel,
    public roomType: RoomType,
  ) {
    super();
  }
}

export interface RoomIncludeBookingProjection extends Room {
  bookings: Booking[];
}
