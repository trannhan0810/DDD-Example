import { ResetPasswordUseCase } from './reset-password.use-case';

import { ICryptoService } from '@application/common/cryto';
import { ResetPasswordInput } from '@application/dtos/auth/reset-password.dto';
import { BaseMessageResponse } from '@application/dtos/base/message-response.dto';
import { DomainError } from '@domain/base/base.error';
import { Person } from '@domain/person-management/entities/person.entity';
import { PersonRepository } from '@domain/person-management/respositories/person.repository';

class MockPersonRepository implements PersonRepository {
  findAll = jest.fn();
  findById = jest.fn();
  findAllMatched = jest.fn();
  findOneMatched = jest.fn();
  countMatched = jest.fn();
  save = jest.fn();
  deleteById = jest.fn();
  addRoles = jest.fn();
  removeRoles = jest.fn();
}

class MockCryptoService implements ICryptoService {
  hash = jest.fn();
  compare = jest.fn();
}

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
  let mockPersonRepository: MockPersonRepository;
  let mockCryptoService: MockCryptoService;

  beforeEach(() => {
    mockPersonRepository = new MockPersonRepository();
    mockCryptoService = new MockCryptoService();
    useCase = new ResetPasswordUseCase(mockPersonRepository, mockCryptoService);
  });

  it('should successfully reset password', async () => {
    const input: ResetPasswordInput = {
      email: 'test@email.com',
      password: 'newPassword',
      resetCode: 'validCode',
    };
    const person = createMockPerson({
      email: 'test@email.com',
      isEmailVerified: true,
      resetPasswordCode: 'validCode',
    });
    jest.spyOn(person, 'verifyResetPasswordCode');
    (person.verifyResetPasswordCode as jest.Mock).mockReturnValueOnce(undefined);
    mockPersonRepository.findOneMatched.mockResolvedValueOnce(person);
    mockCryptoService.hash.mockReturnValueOnce('hashedNewPassword');
    mockPersonRepository.save.mockResolvedValueOnce(person);

    const result = await useCase.process(input);

    expect(mockPersonRepository.findOneMatched).toHaveBeenCalledWith({ email: { isIn: [input.email] } });
    expect(mockCryptoService.hash).toHaveBeenCalledWith(input.password);
    expect(mockPersonRepository.save).toHaveBeenCalled();
    expect(person.hashedPassword).toBe('hashedNewPassword');
    expect(result).toEqual(new BaseMessageResponse('Password reset!'));
  });

  it('should throw an error if person is not found', async () => {
    const input: ResetPasswordInput = {
      email: 'nonexistent@example.com',
      password: 'newPassword',
      resetCode: 'validCode',
    };
    (mockPersonRepository.findOneMatched as jest.Mock).mockResolvedValueOnce(null);

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

    jest.spyOn(person, 'verifyResetPasswordCode');
    (person.verifyResetPasswordCode as jest.Mock).mockImplementationOnce(() => {
      throw new DomainError('Invalid reset code!');
    });

    await expect(useCase.process(input)).rejects.toThrow(new DomainError('Invalid reset code!'));
  });
});
