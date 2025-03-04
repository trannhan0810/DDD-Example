import { BaseRepository } from '@domain/base/base.repository';

import type { RoomType } from '../entities/room-type.entity';

export abstract class RoomTypeRepository extends BaseRepository<RoomType> {
  abstract save(input: RoomType): Promise<Id>;
  abstract delete(id: Id): Promise<void>;
}
