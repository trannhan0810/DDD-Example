import { FindAllPersonResponse } from '@application/dtos/persons/get-all-person.dto';
import { PersonRepository } from '@domain/person-management/repositories/person.repository';

export class FindAllPersonUseCase {
  constructor(private readonly personRepository: PersonRepository) {}

  async process(): Promise<FindAllPersonResponse> {
    const persons = await this.personRepository.findAll();
    return { items: persons };
  }
}
