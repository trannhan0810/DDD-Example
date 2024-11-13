import { DomainError } from '@domain/base/base.error';
import type { RoleSpecificationFactory } from '@domain/permission-management/role/role.specification';
import type { UserRepository } from '@domain/user-management/user/user.repository';
import type { RoleRepository } from '@domain/permission-management/role/role.repository';

export class RemoveRoleInput {
  constructor(readonly userId: string, readonly roleName: string) {}
}

export class RemoveRoleUseCase {
  constructor(
    private readonly roleSpecFactory: RoleSpecificationFactory,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async process(input: RemoveRoleInput): Promise<void> {
    const role = await this.roleRepository.findOneMatched(this.roleSpecFactory.isNameMatched(input.roleName));
    if (!role) throw new DomainError(`Role ${input.roleName} not found!`);

    const user = await this.userRepository.findById(input.userId);
    if (!user) throw new DomainError(`User ${input.userId} not found!`);

    await this.userRepository.removeRoles(user.id, [role.id]);
  }
}
