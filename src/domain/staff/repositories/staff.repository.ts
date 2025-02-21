import { BaseRepository } from '@domain/base/base.repository';

import type { Staff } from '../entities/staff.entity';

export abstract class StaffRepository extends BaseRepository<Staff> {
  abstract save(input: Staff<Id | null>): Promise<void>;
  abstract delete(id: Id): Promise<void>;

  abstract addRoles(roleIds: Id[]): Promise<void>;
  abstract removeRoles(roleIds: Id[]): Promise<void>;
}
