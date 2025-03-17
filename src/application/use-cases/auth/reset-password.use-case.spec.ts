import { ResetPasswordUseCase } from './reset-password.use-case';

import { ICryptoService } from '@application/common/cryto';
import { ResetPasswordInput } from '@application/dtos/auth/reset-password.dto';
import { BaseMessageResponse } from '@application/dtos/base/message-response.dto';
import { DomainError } from '@domain/base/base.error';
import { User } from '@domain/user-management/entities/user.entity';
import { UserRepository } from '@domain/user-management/respositories/user.repository';

class MockUserRepository implements UserRepository {
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

function createMockUser(input?: Partial<User>) {
  return User.create({
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
  let mockUserRepository: MockUserRepository;
  let mockCryptoService: MockCryptoService;

  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    mockCryptoService = new MockCryptoService();
    useCase = new ResetPasswordUseCase(mockUserRepository, mockCryptoService);
  });

  it('should successfully reset password', async () => {
    const input: ResetPasswordInput = {
      email: 'test@email.com',
      password: 'newPassword',
      resetCode: 'validCode',
    };
    const user = createMockUser({
      email: 'test@email.com',
      isEmailVerified: true,
      resetPasswordCode: 'validCode',
    });
    jest.spyOn(user, 'verifyResetPasswordCode');
    (user.verifyResetPasswordCode as jest.Mock).mockReturnValueOnce(undefined);
    mockUserRepository.findOneMatched.mockResolvedValueOnce(user);
    mockCryptoService.hash.mockReturnValueOnce('hashedNewPassword');
    mockUserRepository.save.mockResolvedValueOnce(user);

    const result = await useCase.process(input);

    expect(mockUserRepository.findOneMatched).toHaveBeenCalledWith({ email: { isIn: [input.email] } });
    expect(mockCryptoService.hash).toHaveBeenCalledWith(input.password);
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(user.hashedPassword).toBe('hashedNewPassword');
    expect(result).toEqual(new BaseMessageResponse('Password reset!'));
  });

  it('should throw an error if user is not found', async () => {
    const input: ResetPasswordInput = {
      email: 'nonexistent@example.com',
      password: 'newPassword',
      resetCode: 'validCode',
    };
    (mockUserRepository.findOneMatched as jest.Mock).mockResolvedValueOnce(null);

    await expect(useCase.process(input)).rejects.toThrow(new DomainError('User not found!'));
  });

  it('should throw an error if reset code is invalid', async () => {
    const input: ResetPasswordInput = {
      email: 'test@email.com',
      password: 'newPassword',
      resetCode: 'invalidCode',
    };
    const user = createMockUser({
      email: 'test@email.com',
      isEmailVerified: true,
      resetPasswordCode: 'validCode',
    });
    mockUserRepository.findOneMatched.mockResolvedValueOnce(user);

    jest.spyOn(user, 'verifyResetPasswordCode');
    (user.verifyResetPasswordCode as jest.Mock).mockImplementationOnce(() => {
      throw new DomainError('Invalid reset code!');
    });

    await expect(useCase.process(input)).rejects.toThrow(new DomainError('Invalid reset code!'));
  });
});
