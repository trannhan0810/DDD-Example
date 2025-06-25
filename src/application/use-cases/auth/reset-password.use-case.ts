import { ICryptoService } from '@application/common/cryto';
import { ResetPasswordInput } from '@application/dtos/auth/reset-password.dto';
import { BaseMessageResponse } from '@application/dtos/shared/message-response.dto';
import { PersonRepository } from '@domain/person-management/repositories/person.repository';
import { DomainError } from '@domain/shared/common/base.error';
import { UseCase } from 'src/shared/decorators';

@UseCase()
export class ResetPasswordUseCase {
  constructor(private readonly personRepository: PersonRepository, private readonly cryptoService: ICryptoService) {}

  async process(input: ResetPasswordInput): Promise<BaseMessageResponse> {
    const { email } = input;
    const person = await this.personRepository.findOneMatched({ email });
    if (!person) throw new DomainError('Person not found!');

    const newHashedPassword = await this.cryptoService.hashPassword(input.password);
    person.resetPassword(input.resetCode, newHashedPassword);

    await this.personRepository.save(person);

    return new BaseMessageResponse('Password reset!');
  }
}
