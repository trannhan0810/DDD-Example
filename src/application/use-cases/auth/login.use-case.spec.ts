import { LoginUseCase } from './login.use-case';

import { ICryptoService } from '@application/common/cryto';
import { IJwtService } from '@application/common/jwt';
import { LoginInput } from '@application/dtos/auth/login.dto';
import { Person } from '@domain/person-management/entities/person.entity';
import { PersonRepository } from '@domain/person-management/respositories/person.repository';
import { DomainError } from '@domain/shared/common/base.error';

const MPersonRepository = PersonRepository as ClassType<PersonRepository>;
new MPersonRepository();

class MockPersonRepository extends PersonRepository {
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

class MockJwtService extends IJwtService {
  generateToken = jest.fn();
  verifyToken = jest.fn();
  decodeToken = jest.fn();
}

class MockCryptoService extends ICryptoService {
  hash = jest.fn();
}

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  const mockPersonRepository = new MockPersonRepository();
  const mockCryptoService = new MockCryptoService();
  const mockJwtService = new MockJwtService();

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
    mockCryptoService.hash.mockReturnValueOnce(hashedPassword);
    mockJwtService.generateToken.mockResolvedValueOnce('access-token');
    mockJwtService.generateToken.mockResolvedValueOnce('refresh-token');

    const result = await useCase.process(loginInput);

    expect(result).toEqual({ accessToken: 'access-token', refreshToken: 'refresh-token' });
    expect(mockPersonRepository.findOneMatched).toHaveBeenCalledWith({ email: { isIn: [loginInput.email] } });
    expect(mockCryptoService.hash).toHaveBeenCalledWith(loginInput.password);
    expect(mockJwtService.generateToken).toHaveBeenCalledTimes(2);
  });

  it('should throw a DomainError for invalid credentials', async () => {
    const loginInput: LoginInput = { email: 'person@example.com', password: 'wrong-password' };
    const expectedError = new DomainError('Email or password is incorrect');
    mockPersonRepository.findOneMatched.mockResolvedValueOnce(undefined);

    await expect(useCase.process(loginInput)).rejects.toThrow(expectedError);
    expect(mockPersonRepository.findOneMatched).toHaveBeenCalledWith({ email: { isIn: [loginInput.email] } });
    expect(mockCryptoService.hash).toHaveBeenCalledTimes(1);
    expect(mockJwtService.generateToken).toHaveBeenCalledTimes(0);
  });

  it('should throw an error if personRepository.findOneMatched throws an error', async () => {
    const expectedError = new Error('Database error');
    mockPersonRepository.findOneMatched.mockRejectedValueOnce(expectedError);
    const loginInput: LoginInput = { email: 'person@example.com', password: 'password' };

    await expect(useCase.process(loginInput)).rejects.toThrow(expectedError);
    expect(mockPersonRepository.findOneMatched).toHaveBeenCalledWith({ email: { isIn: [loginInput.email] } });
    expect(mockCryptoService.hash).toHaveBeenCalledTimes(0);
    expect(mockJwtService.generateToken).toHaveBeenCalledTimes(0);
  });
});
