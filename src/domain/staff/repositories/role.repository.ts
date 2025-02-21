import { BaseRepository } from '@domain/base/base.repository';

import type { Role } from '../entities/role.entity';
import type { IdFilter, StringFilter } from '@domain/base/base.filter';

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

  abstract save(input: Role): Promise<void>;
  abstract delete(id: Id): Promise<void>;
}
