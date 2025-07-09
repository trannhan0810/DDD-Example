import { BaseMessageResponse } from '@application/dtos/shared/message-response.dto';
import { Person } from '@domain/person-management/entities/person.entity';
import { DomainError } from '@domain/shared/common/base.error';

import type { ICryptoService } from '@application/common/cryto';
import type { CreatePersonInput } from '@application/dtos/persons/create-person.dto';
import type { PersonRepository } from '@domain/person-management/repositories/person.repository';

export class CreatePersonUseCase {
  constructor(private readonly personRepository: PersonRepository, private readonly cryptoService: ICryptoService) {}

  async process(input: CreatePersonInput): Promise<BaseMessageResponse> {
    const existPerson = await this.personRepository.findOneMatched({ email: { $in: [input.email] } });
    if (!existPerson) throw new DomainError('Email is used!');

    const newPerson = Person.create({
      email: input.email,
      firstname: input.firstname,
      lastname: input.lastname,
      hashedPassword: await this.cryptoService.hashPassword(input.password),
    });
    await this.personRepository.save(newPerson);
    return new BaseMessageResponse('Create person successfully');
  }
}
