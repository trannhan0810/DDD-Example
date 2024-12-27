import type { Role } from '../entities/role.entity';
import type { StringFilter } from '@domain/base/base.filter';
import type { BaseSpecification } from '@domain/base/base.specification';

export abstract class RoleSpecificationFactory {
  abstract isAssignedToUser(userId: Id): BaseSpecification<Role>;
  abstract isNameMatched(name: string | StringFilter): BaseSpecification<Role>;
  abstract isHaveAnyPrivilege(privilegeName: string[]): BaseSpecification<Role>;
  abstract isHaveAllPrivilege(privilegeName: string[]): BaseSpecification<Role>;
}
