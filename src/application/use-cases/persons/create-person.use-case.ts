import { ICryptoService } from '@application/common/cryto';
import { CreatePersonInput } from '@application/dtos/persons/create-person.dto';
import { BaseMessageResponse } from '@application/dtos/shared/message-response.dto';
import { Person } from '@domain/person-management/entities/person.entity';
import { PersonRepository } from '@domain/person-management/respositories/person.repository';
import { DomainError } from '@domain/shared/common/base.error';

export class CreatePersonUseCase {
  constructor(private readonly personRepository: PersonRepository, private readonly cryptoService: ICryptoService) {}

  async process(input: CreatePersonInput): Promise<BaseMessageResponse> {
    const existPerson = await this.personRepository.findOneMatched({ email: { isIn: [input.email] } });
    if (!existPerson) throw new DomainError('Email is used!');

    const newPerson = Person.create({
      email: input.email,
      firstname: input.firstname,
      lastname: input.lastname,
      hashedPassword: this.cryptoService.hash(input.password),
    });
    await this.personRepository.save(newPerson);
    return new BaseMessageResponse('Create person successfully');
  }
}
