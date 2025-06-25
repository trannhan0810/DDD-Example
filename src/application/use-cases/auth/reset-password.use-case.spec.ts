import { ResetPasswordUseCase } from './reset-password.use-case';

import { ICryptoService } from '@application/common/cryto';
import { ResetPasswordInput } from '@application/dtos/auth/reset-password.dto';
import { BaseMessageResponse } from '@application/dtos/shared/message-response.dto';
import { Person } from '@domain/person-management/entities/person.entity';
import { PersonRepository } from '@domain/person-management/repositories/person.repository';
import { DomainError } from '@domain/shared/common/base.error';
import { mock } from 'jest-mock-extended';
import { _MockProxy } from 'jest-mock-extended/lib/Mock';

function createMockPerson(input?: Partial<Person>) {
  return Person.create({
    id: '1',
    email: 'test@email.com',
    firstname: 'firstname',
    lastname: 'lastname',
    hashedPassword: 'hashedPassword',
    isEmailVerified: false,
    resetPasswordCode: null,
    resetPasswordCodeExpireTime: null,
    ...input,
  });
}

describe('ResetPasswordUseCase', () => {
  let useCase: ResetPasswordUseCase;
  let mockPersonRepository: _MockProxy<PersonRepository>;
  let mockCryptoService: _MockProxy<ICryptoService>;

  beforeEach(() => {
    mockPersonRepository = mock<PersonRepository>();
    mockCryptoService = mock<ICryptoService>();
    useCase = new ResetPasswordUseCase(mockPersonRepository, mockCryptoService);
  });

  it('should successfully reset password', async () => {
    const validResetCode = 'validCode';
    const input: ResetPasswordInput = {
      email: 'test@email.com',
      password: 'newPassword',
      resetCode: validResetCode,
    };
    const person = createMockPerson({
      email: 'test@email.com',
      isEmailVerified: true,
      resetPasswordCode: validResetCode,
      resetPasswordCodeExpireTime: new Date(Date.now() + 1000),
    });
    jest.spyOn(person, 'resetPassword');
    mockPersonRepository.findOneMatched.mockResolvedValueOnce(person);
    mockCryptoService.hashPassword.mockResolvedValueOnce('hashedNewPassword');
    mockPersonRepository.save.mockResolvedValueOnce(person.id);

    const result = await useCase.process(input);

    expect(mockPersonRepository.findOneMatched).toHaveBeenCalledWith({ email: input.email });
    expect(mockCryptoService.hashPassword).toHaveBeenCalledWith(input.password);
    expect(mockPersonRepository.save).toHaveBeenCalled();
    expect(person.resetPassword).toHaveBeenCalledWith(validResetCode, 'hashedNewPassword');
    expect(result).toEqual(new BaseMessageResponse('Password reset!'));
  });

  it('should throw an error if person is not found', async () => {
    const input: ResetPasswordInput = {
      email: 'nonexistent@example.com',
      password: 'newPassword',
      resetCode: 'validCode',
    };
    mockPersonRepository.findOneMatched.mockResolvedValueOnce(undefined);

    await expect(useCase.process(input)).rejects.toThrow(new DomainError('Person not found!'));
  });

  it('should throw an error if reset code is invalid', async () => {
    const input: ResetPasswordInput = {
      email: 'test@email.com',
      password: 'newPassword',
      resetCode: 'invalidCode',
    };
    const person = createMockPerson({
      email: 'test@email.com',
      isEmailVerified: true,
      resetPasswordCode: 'validCode',
    });
    mockPersonRepository.findOneMatched.mockResolvedValueOnce(person);

    jest.spyOn(person, 'resetPassword');
    (person.resetPassword as jest.Mock).mockImplementationOnce(() => {
      throw new DomainError('Invalid reset code!');
    });

    await expect(useCase.process(input)).rejects.toThrow(new DomainError('Invalid reset code!'));
  });
});
