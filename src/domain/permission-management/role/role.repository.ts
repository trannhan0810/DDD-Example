import type { Role } from './role.entity';
import type { Privilege } from '../privilege/privilege.value-object';
import type { EntityId } from '@domain/base/base.entity';
import type { BaseRepository } from '@domain/base/base.repository';
import type { ISpecification } from '@domain/base/base.specification';

interface RoleAndPrivileges extends Role {
  privileges: Privilege;
}

export abstract class RoleRepository implements BaseRepository<Role> {
  abstract findAll(): Promise<Role[]>;
  abstract findById(id: EntityId): Promise<Role>;
  abstract findAllMatched(spec: ISpecification<Role>): Promise<Role[]>;
  abstract findOneMatched(spec: ISpecification<Role>): Promise<Role | undefined>;
  abstract countMatched(spec: ISpecification<Role>): Promise<number>;

  abstract findWithPrivilege(spec: ISpecification<Role>): Promise<RoleAndPrivileges[]>;
}
