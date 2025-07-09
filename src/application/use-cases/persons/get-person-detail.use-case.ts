import { DomainError } from '@domain/shared/common/base.error';

import type { PersonDetailResponse } from '@application/dtos/persons/get-one-person.dto';
import type { PersonRepository } from '@domain/person-management/repositories/person.repository';

export class GetPersonDetailUseCase {
  constructor(private readonly personRepository: PersonRepository) {}

  async process(id: string): Promise<PersonDetailResponse> {
    const person = await this.personRepository.findById(id);
    if (!person) throw new DomainError('Person not found!');
    return person;
  }
}
