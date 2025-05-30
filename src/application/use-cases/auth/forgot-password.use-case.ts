import { IEmailSender } from '@application/common/email/email-sender';
import { getSendResetPasswordEmailParams } from '@application/common/email/templates/reset-password';
import { ForgotPasswordInput } from '@application/dtos/auth/forgot-password.dto';
import { BaseMessageResponse } from '@application/dtos/shared/message-response.dto';
import { Person } from '@domain/person-management/entities/person.entity';
import { PersonRepository } from '@domain/person-management/respositories/person.repository';
import { DomainError } from '@domain/shared/common/base.error';
import { UseCase } from 'src/shared/decorators';

@UseCase()
export class ForgotPasswordUseCase {
  constructor(private readonly personRepository: PersonRepository, private readonly emailService: IEmailSender) {}

  async process(input: ForgotPasswordInput): Promise<BaseMessageResponse> {
    const person = await this.personRepository.findOneMatched({
      email: { isIn: [input.email] },
    });
    if (!person) throw new DomainError('Person not found!');
    if (!person.isEmailVerified) throw new DomainError('Email is not verified!');

    const { code } = person.updateResetPasswordCode();
    await this.personRepository.save(person);
    await this.sendEmailResetPassword(person, code);

    return new BaseMessageResponse('Reset password code send!');
  }

  async sendEmailResetPassword(person: Person, code: string) {
    const template = getSendResetPasswordEmailParams({ code, email: person.email });
    await this.emailService.sendEmail(template);
  }
}
