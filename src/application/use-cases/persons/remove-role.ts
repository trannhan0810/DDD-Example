import { BaseMessageResponse } from '@application/dtos/base/message-response.dto';
import { RemoveRoleInput } from '@application/dtos/persons/person-role.dto';
import { DomainError } from '@domain/base/base.error';
import { PersonRepository } from '@domain/person-management/respositories/person.repository';
import { RoleRepository } from '@domain/staff/repositories/role.repository';

export class RemoveRoleUseCase {
  constructor(private readonly personRepository: PersonRepository, private readonly roleRepository: RoleRepository) {}

  async process(input: RemoveRoleInput): Promise<BaseMessageResponse> {
    const personId = input.personId;
    const person = await this.personRepository.findById(input.personId);
    if (!person) throw new DomainError(`Person ${input.personId} not found!`);

    const role = await this.roleRepository.findOneMatched({ personId: { isIn: [personId] } });
    if (!role) return new BaseMessageResponse('Role not assigned to this person', false);

    await this.personRepository.removeRoles(person.id, [role.id]);
    return new BaseMessageResponse('Role removed successfully');
  }
}
