import { LoginUseCase } from './login.use-case';

import { ICryptoService } from '@application/common/cryto';
import { IJwtService } from '@application/common/jwt';
import { LoginInput } from '@application/dtos/auth/login.dto';
import { DomainError } from '@domain/base/base.error';
import { User } from '@domain/user-management/entities/user.entity';
import { UserRepository } from '@domain/user-management/respositories/user.repository';

const MUserRepository = UserRepository as ClassType<UserRepository>;
new MUserRepository();

class MockUserRepository extends UserRepository {
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
  const mockUserRepository = new MockUserRepository();
  const mockCryptoService = new MockCryptoService();
  const mockJwtService = new MockJwtService();

  beforeEach(() => {
    jest.resetAllMocks();
    useCase = new LoginUseCase(mockUserRepository, mockCryptoService, mockJwtService);
  });

  it('should successfully login a user with valid credentials', async () => {
    const mockUser: User = {
      id: 'user-id',
      email: 'user@example.com',
      firstname: 'Firstname',
      lastname: 'Lastname',
      isEmailVerified: true,
      hashedPassword: 'hashed-password',
      resetPasswordCode: null,
      resetPasswordCodeExpireTime: null,
    } as User;
    const password = '123456';
    const hashedPassword = 'hashed-password';
    const loginInput: LoginInput = { email: mockUser.email, password: password };

    mockUserRepository.findOneMatched.mockResolvedValueOnce(mockUser);
    mockCryptoService.hash.mockReturnValueOnce(hashedPassword);
    mockJwtService.generateToken.mockResolvedValueOnce('access-token');
    mockJwtService.generateToken.mockResolvedValueOnce('refresh-token');

    const result = await useCase.process(loginInput);

    expect(result).toEqual({ accessToken: 'access-token', refreshToken: 'refresh-token' });
    expect(mockUserRepository.findOneMatched).toHaveBeenCalledWith({ email: { isIn: [loginInput.email] } });
    expect(mockCryptoService.hash).toHaveBeenCalledWith(loginInput.password);
    expect(mockJwtService.generateToken).toHaveBeenCalledTimes(2);
  });

  it('should throw a DomainError for invalid credentials', async () => {
    const loginInput: LoginInput = { email: 'user@example.com', password: 'wrong-password' };
    const expectedError = new DomainError('Email or password is incorrect');
    mockUserRepository.findOneMatched.mockResolvedValueOnce(undefined);

    await expect(useCase.process(loginInput)).rejects.toThrow(expectedError);
    expect(mockUserRepository.findOneMatched).toHaveBeenCalledWith({ email: { isIn: [loginInput.email] } });
    expect(mockCryptoService.hash).toHaveBeenCalledTimes(1);
    expect(mockJwtService.generateToken).toHaveBeenCalledTimes(0);
  });

  it('should throw an error if userRepository.findOneMatched throws an error', async () => {
    const expectedError = new Error('Database error');
    mockUserRepository.findOneMatched.mockRejectedValueOnce(expectedError);
    const loginInput: LoginInput = { email: 'user@example.com', password: 'password' };

    await expect(useCase.process(loginInput)).rejects.toThrow(expectedError);
    expect(mockUserRepository.findOneMatched).toHaveBeenCalledWith({ email: { isIn: [loginInput.email] } });
    expect(mockCryptoService.hash).toHaveBeenCalledTimes(0);
    expect(mockJwtService.generateToken).toHaveBeenCalledTimes(0);
  });
});
