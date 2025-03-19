import { PersonDetailResponse } from '@application/dtos/persons/get-one-person.dto';
import { DomainError } from '@domain/base/base.error';
import { PersonRepository } from '@domain/person-management/respositories/person.repository';

export class GetPersonDetailUseCase {
  constructor(private readonly personRepository: PersonRepository) {}

  async process(id: string): Promise<PersonDetailResponse> {
    const person = await this.personRepository.findById(id);
    if (!person) throw new DomainError('Person not found!');
    return person;
  }
}
