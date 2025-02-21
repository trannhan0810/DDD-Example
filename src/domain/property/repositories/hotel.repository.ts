import { BaseRepository } from '@domain/base/base.repository';
import { Injectable } from '@nestjs/common';

import type { Hotel } from '../entities/hotel.entity';

@Injectable()
export abstract class HotelRepository extends BaseRepository<Hotel> {
  abstract save(input: Hotel): Promise<void>;
  abstract delete(id: Id): Promise<void>;
}
