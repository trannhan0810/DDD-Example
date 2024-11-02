import type { BaseSpecification } from '@domain/base/base.specification';
import type { StringMatcher } from '@domain/base/base.matcher';
import type { Role } from './role.entity';
import type { EntityId } from '@domain/base/base.entity';

export abstract class RoleSpecificationFactory {
  abstract isAssignedToUser(userId: EntityId): BaseSpecification<Role>;
  abstract isNameMatched(name: string | StringMatcher): BaseSpecification<Role>;
  abstract isHaveAnyPrivilege(privilegeName: string[]): BaseSpecification<Role>;
  abstract isHaveAllPrivilege(privilegeName: string[]): BaseSpecification<Role>;
}
