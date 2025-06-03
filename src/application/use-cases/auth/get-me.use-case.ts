import { GetMeResponse } from '@application/dtos/auth/get-me.dto';
import { PersonRepository } from '@domain/person-management/repositories/person.repository';
import { DomainError } from '@domain/shared/common/base.error';
import { UseCase } from 'src/shared/decorators';

@UseCase()
export class GetMeUseCase {
  constructor(private readonly personRepository: PersonRepository) {}

  async process(input: { id: Id }): Promise<GetMeResponse> {
    const person = await this.personRepository.findById(input.id);
    if (!person) {
      throw new DomainError('Person not found!');
    }
    return { ...person, roles: [] };
  }
}
