import type { BaseRepository } from '@domain/base/base.repository';
import type { EntityId } from '@domain/base/base.entity';
import type { ISpecification } from '@domain/base/base.specification';
import type { Booking } from './booking.entity';

export abstract class BookingRepository implements BaseRepository<Booking> {
  abstract findAll(): Promise<Booking[]>;
  abstract findById(id: EntityId): Promise<Booking | undefined>;
  abstract findAllMatched(spec: ISpecification<Booking>): Promise<Booking[]>;
  abstract findOneMatched(spec: ISpecification<Booking>): Promise<Booking | undefined>;
  abstract countMatched(spec: ISpecification<Booking>): Promise<number>;

  abstract save(booking: Omit<Booking, 'id'>): Promise<void>;
  abstract delete(booking: Booking): Promise<void>;
}
