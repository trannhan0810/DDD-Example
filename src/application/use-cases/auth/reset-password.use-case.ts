import { ICryptoService } from '@application/common/cryto';
import { ResetPasswordInput } from '@application/dtos/auth/reset-password.dto';
import { BaseMessageResponse } from '@application/dtos/base/message-response.dto';
import { DomainError } from '@domain/base/base.error';
import { PersonRepository } from '@domain/person-management/respositories/person.repository';

export class ResetPasswordUseCase {
  constructor(private readonly personRepository: PersonRepository, private readonly cryptoService: ICryptoService) {}

  async process(input: ResetPasswordInput): Promise<BaseMessageResponse> {
    const person = await this.personRepository.findOneMatched({ email: { isIn: [input.email] } });
    if (!person) throw new DomainError('Person not found!');
    person.verifyResetPasswordCode(input.resetCode);

    person.hashedPassword = this.cryptoService.hash(input.password);
    await this.personRepository.save(person);

    return new BaseMessageResponse('Password reset!');
  }
}
