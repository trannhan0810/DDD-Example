import { PersonDetailResponse } from '@application/dtos/persons/get-one-person.dto';
import { PersonRepository } from '@domain/person-management/repositories/person.repository';
import { DomainError } from '@domain/shared/common/base.error';

export class GetPersonDetailUseCase {
  constructor(private readonly personRepository: PersonRepository) {}

  async process(id: string): Promise<PersonDetailResponse> {
    const person = await this.personRepository.findById(id);
    if (!person) throw new DomainError('Person not found!');
    return person;
  }
}
