import { DomainError } from '@domain/base/base.error';
import type { RoleSpecificationFactory } from '@domain/permission-management/role/role.specification';
import type { RoleRepository } from '@domain/permission-management/role/role.repository';
import type { UserRepository } from '@domain/user-management/user/user.repository';

export interface AssignRoleInput {
  userId: string;
  roleName: string;
}

export class AssignRoleUseCase {
  constructor(
    private readonly roleSpecFactory: RoleSpecificationFactory,
    private readonly roleRepository: RoleRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async process(input: AssignRoleInput): Promise<void> {
    const role = await this.roleRepository.findOneMatched(this.roleSpecFactory.isNameMatched(input.roleName));
    if (!role) throw new DomainError(`Role ${input.roleName} not found!`);

    const user = await this.userRepository.findById(input.userId);
    if (!user) throw new DomainError(`User ${input.userId} not found!`);

    await this.userRepository.addRoles(user.id, [role.id]);
  }
}
