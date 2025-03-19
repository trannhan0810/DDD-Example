import { BaseRepository } from '@domain/shared/common/base.repository';

import type { Role } from '../entities/role.entity';
import type { IdFilter, StringFilter } from '@domain/shared/common/base.filter';

export type FilterRoleInput = {
  id: IdFilter;
  name: StringFilter;
  scope: StringFilter;
  personId: IdFilter;
};

export abstract class RoleRepository extends BaseRepository<Role> {
  abstract findAllMatched(filter: Partial<FilterRoleInput>): Promise<Role[]>;
  abstract findOneMatched(filter: Partial<FilterRoleInput>): Promise<Role | undefined>;
  abstract countMatched(filter: Partial<FilterRoleInput>): Promise<number>;

  abstract findWithPrivilege(filter: Partial<FilterRoleInput>): Promise<Role[]>;

  abstract save(input: Role): Promise<Id>;
  abstract delete(id: Id): Promise<void>;
}
