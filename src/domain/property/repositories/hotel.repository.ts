import { BaseRepository } from '@domain/shared/common/base.repository';
import { Injectable } from '@nestjs/common';

import type { Hotel } from '../entities/hotel.entity';

@Injectable()
export abstract class HotelRepository extends BaseRepository<Hotel> {
  abstract save(input: Hotel): Promise<Id>;
  abstract delete(id: Id): Promise<void>;
}
