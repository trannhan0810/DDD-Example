import type { Role } from '../entities/role.entity';
import type { Privilege } from '../value-objects/privilege.value-object';
import type { IdFilter, StringFilter } from '@domain/base/base.filter';
import type { BaseRepository } from '@domain/base/base.repository';

interface RoleAndPrivileges extends Role {
  privileges: Privilege;
}

export type FilterRoleInput = {
  id: IdFilter;
  name: StringFilter;
  scope: StringFilter;
  personId: IdFilter;
};

export abstract class RoleRepository implements BaseRepository<Role> {
  abstract findAll(): Promise<Role[]>;
  abstract findById(id: Id): Promise<Role>;
  abstract findAllMatched(filter: Partial<FilterRoleInput>): Promise<Role[]>;
  abstract findOneMatched(filter: Partial<FilterRoleInput>): Promise<Role | undefined>;
  abstract countMatched(filter: Partial<FilterRoleInput>): Promise<number>;

  abstract findWithPrivilege(filter: Partial<FilterRoleInput>): Promise<RoleAndPrivileges[]>;
}
