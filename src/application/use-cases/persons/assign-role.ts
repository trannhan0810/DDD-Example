import { AssignRoleInput } from '@application/dtos/persons/person-role.dto';
import { DomainError } from '@domain/base/base.error';
import { PersonRepository } from '@domain/person-management/respositories/person.repository';
import { RoleRepository } from '@domain/staff/repositories/role.repository';

export class AssignRoleUseCase {
  constructor(private readonly roleRepository: RoleRepository, private readonly personRepository: PersonRepository) {}

  async process(input: AssignRoleInput): Promise<void> {
    const personId = input.personId;
    const role = await this.roleRepository.findOneMatched({ personId: { isIn: [personId] } });
    if (!role) throw new DomainError(`Role ${input.roleName} not found!`);

    const person = await this.personRepository.findById(input.personId);
    if (!person) throw new DomainError(`Person ${input.personId} not found!`);

    await this.personRepository.addRoles(person.id, [role.id]);
  }
}
