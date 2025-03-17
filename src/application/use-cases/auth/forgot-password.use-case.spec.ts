import { ForgotPasswordUseCase } from './forgot-password.use-case';

import { IEmailService } from '@application/common/email/email';
import { getSendResetPasswordEmailParams } from '@application/common/email/templates/reset-password';
import { ForgotPasswordInput } from '@application/dtos/auth/forgot-password.dto';
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

class MockEmailService implements IEmailService {
  sendMail = jest.fn();
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

describe('ForgotPasswordUseCase', () => {
  let useCase: ForgotPasswordUseCase;
  let mockUserRepository: MockUserRepository;
  let mockEmailService: MockEmailService;

  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    mockEmailService = new MockEmailService();
    useCase = new ForgotPasswordUseCase(mockUserRepository, mockEmailService);
  });

  it('should successfully send reset password email', async () => {
    const input: ForgotPasswordInput = { email: 'test@example.com' };
    const user: User = createMockUser({
      id: 'user-id',
      email: 'test@example.com',
      firstname: 'Test',
      lastname: 'User',
      hashedPassword: 'hashedPassword',
      isEmailVerified: true,
    });
    mockUserRepository.findOneMatched.mockResolvedValueOnce(user);
    mockUserRepository.save.mockResolvedValueOnce(user);

    const result = await useCase.process(input);

    expect(mockUserRepository.findOneMatched).toHaveBeenCalledWith({ email: { isIn: [input.email] } });
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(mockEmailService.sendMail).toHaveBeenCalled();
    expect(result).toEqual(new BaseMessageResponse('Reset password code send!'));
  });

  it('should throw an error if user is not found', async () => {
    const input: ForgotPasswordInput = { email: 'nonexistent@example.com' };
    (mockUserRepository.findOneMatched as jest.Mock).mockResolvedValueOnce(null);

    await expect(useCase.process(input)).rejects.toThrow(new DomainError('User not found!'));
  });

  it('should throw an error if email is not verified', async () => {
    const input: ForgotPasswordInput = { email: 'unverified@example.com' };
    const user = createMockUser({
      id: 'user-id',
      email: 'unverified@example.com',
      firstname: 'Test',
      lastname: 'User',
      hashedPassword: 'hashedPassword',
      isEmailVerified: false,
    });
    (mockUserRepository.findOneMatched as jest.Mock).mockResolvedValueOnce(user);

    await expect(useCase.process(input)).rejects.toThrow(new DomainError('Email is not verified!'));
  });

  it('should call sendEmailResetPassword with correct parameters', async () => {
    const input: ForgotPasswordInput = { email: 'test@example.com' };
    const user = createMockUser({
      id: 'user-id',
      email: 'test@example.com',
      firstname: 'Test',
      lastname: 'User',
      hashedPassword: 'hashedPassword',
      isEmailVerified: true,
    });
    (mockUserRepository.findOneMatched as jest.Mock).mockResolvedValueOnce(user);
    (mockUserRepository.save as jest.Mock).mockResolvedValueOnce(user);

    await useCase.process(input);

    const code = user.resetPasswordCode;
    const expectedTemplate = getSendResetPasswordEmailParams({ code: code!, email: user.email });
    expect(mockEmailService.sendMail).toHaveBeenCalledWith(expectedTemplate);
  });
});
