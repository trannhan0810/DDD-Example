import type { Hotel } from './hotel.entity';
import type { RoomType } from './room-type.entity';
import type { Booking } from '@domain/bookings/entities/booking.entity';

export class Room {
  constructor(
    public readonly id: Id,
    public readonly name: string,
    public description: string,
    public capacityPeople: number,
    public area: number,

    public hotel: Hotel,
    public roomType: RoomType,
    public amenities: string[],
  ) {}
}

export interface RoomIncludeBookingProjection extends Room {
  bookings: Booking[];
}
