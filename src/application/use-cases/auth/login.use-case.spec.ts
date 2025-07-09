import { LoginUseCase } from './login.use-case';

import { DomainError } from '@domain/shared/common/base.error';

import { mock } from 'jest-mock-extended';

import type { ICryptoService } from '@application/common/cryto';
import type { IJwtService } from '@application/common/jwt';
import type { LoginInput } from '@application/dtos/auth/login.dto';
import type { Person } from '@domain/person-management/entities/person.entity';
import type { PersonRepository } from '@domain/person-management/repositories/person.repository';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  const mockPersonRepository = mock<PersonRepository>();
  const mockCryptoService = mock<ICryptoService>();
  const mockJwtService = mock<IJwtService>();

  beforeEach(() => {
    jest.resetAllMocks();
    useCase = new LoginUseCase(mockPersonRepository, mockCryptoService, mockJwtService);
  });

  it('should successfully login a person with valid credentials', async () => {
    const mockPerson: Person = {
      id: 'person-id',
      email: 'person@example.com',
      firstname: 'Firstname',
      lastname: 'Lastname',
      isEmailVerified: true,
      hashedPassword: 'hashed-password',
      resetPasswordCode: null,
      resetPasswordCodeExpireTime: null,
    } as Person;
    const password = '123456';
    const hashedPassword = 'hashed-password';
    const loginInput: LoginInput = { email: mockPerson.email, password: password };

    mockPersonRepository.findOneMatched.mockResolvedValueOnce(mockPerson);
    mockCryptoService.hashPassword.mockResolvedValueOnce(hashedPassword);
    mockJwtService.generateToken.mockResolvedValueOnce('access-token');
    mockJwtService.generateToken.mockResolvedValueOnce('refresh-token');

    const result = await useCase.process(loginInput);

    expect(result).toEqual({ accessToken: 'access-token', refreshToken: 'refresh-token' });
    expect(mockPersonRepository.findOneMatched).toHaveBeenCalledWith({ email: loginInput.email });
    expect(mockCryptoService.hashPassword).toHaveBeenCalledWith(loginInput.password);
    expect(mockJwtService.generateToken).toHaveBeenCalledTimes(2);
  });

  it('should throw a DomainError for invalid credentials', async () => {
    const loginInput: LoginInput = { email: 'person@example.com', password: 'wrong-password' };
    const expectedError = new DomainError('Email or password is incorrect');
    mockPersonRepository.findOneMatched.mockResolvedValueOnce(undefined);

    await expect(useCase.process(loginInput)).rejects.toThrow(expectedError);
    expect(mockPersonRepository.findOneMatched).toHaveBeenCalledWith({ email: loginInput.email });
    expect(mockCryptoService.hashPassword).toHaveBeenCalledTimes(1);
    expect(mockJwtService.generateToken).toHaveBeenCalledTimes(0);
  });

  it('should throw an error if personRepository.findOneMatched throws an error', async () => {
    const expectedError = new Error('Database error');
    mockPersonRepository.findOneMatched.mockRejectedValueOnce(expectedError);
    const loginInput: LoginInput = { email: 'person@example.com', password: 'password' };

    await expect(useCase.process(loginInput)).rejects.toThrow(expectedError);
    expect(mockPersonRepository.findOneMatched).toHaveBeenCalledWith({ email: loginInput.email });
    expect(mockCryptoService.hashPassword).toHaveBeenCalledTimes(0);
    expect(mockJwtService.generateToken).toHaveBeenCalledTimes(0);
  });
});
