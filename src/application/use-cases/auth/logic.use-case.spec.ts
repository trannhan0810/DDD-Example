import { LoginUseCase } from './login.use-case';

import { ICryptoService } from '@application/common/cryto';
import { IJwtService } from '@application/common/jwt';
import { LoginInput } from '@application/dtos/auth/login.dto';
import { DomainError } from '@domain/base/base.error';
import { User } from '@domain/user-management/entities/user.entity';
import { UserRepository } from '@domain/user-management/user/user.repository';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  const mockUserRepository = { findOneMatched: jest.fn() };
  const mockCryptoService = { hash: jest.fn() };
  const mockJwtService = { generateToken: jest.fn() };

  beforeEach(() => {
    jest.resetAllMocks();
    useCase = new LoginUseCase(
      mockUserRepository as unknown as UserRepository,
      mockCryptoService as unknown as ICryptoService,
      mockJwtService as unknown as IJwtService,
    );
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

    expect(result).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
    expect(mockUserRepository.findOneMatched).toHaveBeenCalledWith({ email: { isIn: [loginInput.email] } });
    expect(mockCryptoService.hash).toHaveBeenCalledWith(loginInput.password);
    expect(mockJwtService.generateToken).toHaveBeenCalledTimes(2);
  });

  it('should throw a DomainError for invalid credentials', async () => {
    const loginInput: LoginInput = { email: 'user@example.com', password: 'wrong-password' };
    const expectedError = new DomainError('Email or password is incorrect');
    mockUserRepository.findOneMatched.mockResolvedValueOnce(null);

    await expect(useCase.process(loginInput)).rejects.toThrow(expectedError);
    expect(mockUserRepository.findOneMatched).toHaveBeenCalledWith({
      email: { isIn: [loginInput.email] },
    });
    expect(mockCryptoService.hash).toHaveBeenCalledTimes(1);
    expect(mockJwtService.generateToken).toHaveBeenCalledTimes(0);
  });

  it('should throw an error if userRepository.findOneMatched throws an error', async () => {
    const expectedError = new Error('Database error');
    mockUserRepository.findOneMatched.mockRejectedValueOnce(expectedError);
    const loginInput: LoginInput = { email: 'user@example.com', password: 'password' };

    await expect(useCase.process(loginInput)).rejects.toThrow(expectedError);
    expect(mockUserRepository.findOneMatched).toHaveBeenCalledWith({
      email: { isIn: [loginInput.email] },
    });
    expect(mockCryptoService.hash).toHaveBeenCalledTimes(0);
    expect(mockJwtService.generateToken).toHaveBeenCalledTimes(0);
  });
});
