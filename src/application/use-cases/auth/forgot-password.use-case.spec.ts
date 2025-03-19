import { ForgotPasswordUseCase } from './forgot-password.use-case';

import { IEmailService } from '@application/common/email/email';
import { getSendResetPasswordEmailParams } from '@application/common/email/templates/reset-password';
import { ForgotPasswordInput } from '@application/dtos/auth/forgot-password.dto';
import { BaseMessageResponse } from '@application/dtos/base/message-response.dto';
import { Person } from '@domain/person-management/entities/person.entity';
import { PersonRepository } from '@domain/person-management/respositories/person.repository';
import { DomainError } from '@domain/shared/common/base.error';

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

class MockEmailService implements IEmailService {
  sendMail = jest.fn();
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

describe('ForgotPasswordUseCase', () => {
  let useCase: ForgotPasswordUseCase;
  let mockPersonRepository: MockPersonRepository;
  let mockEmailService: MockEmailService;

  beforeEach(() => {
    mockPersonRepository = new MockPersonRepository();
    mockEmailService = new MockEmailService();
    useCase = new ForgotPasswordUseCase(mockPersonRepository, mockEmailService);
  });

  it('should successfully send reset password email', async () => {
    const input: ForgotPasswordInput = { email: 'test@example.com' };
    const person: Person = createMockPerson({
      id: 'person-id',
      email: 'test@example.com',
      firstname: 'Test',
      lastname: 'Person',
      hashedPassword: 'hashedPassword',
      isEmailVerified: true,
    });
    mockPersonRepository.findOneMatched.mockResolvedValueOnce(person);
    mockPersonRepository.save.mockResolvedValueOnce(person);

    const result = await useCase.process(input);

    expect(mockPersonRepository.findOneMatched).toHaveBeenCalledWith({ email: { isIn: [input.email] } });
    expect(mockPersonRepository.save).toHaveBeenCalled();
    expect(mockEmailService.sendMail).toHaveBeenCalled();
    expect(result).toEqual(new BaseMessageResponse('Reset password code send!'));
  });

  it('should throw an error if person is not found', async () => {
    const input: ForgotPasswordInput = { email: 'nonexistent@example.com' };
    (mockPersonRepository.findOneMatched as jest.Mock).mockResolvedValueOnce(null);

    await expect(useCase.process(input)).rejects.toThrow(new DomainError('Person not found!'));
  });

  it('should throw an error if email is not verified', async () => {
    const input: ForgotPasswordInput = { email: 'unverified@example.com' };
    const person = createMockPerson({
      id: 'person-id',
      email: 'unverified@example.com',
      firstname: 'Test',
      lastname: 'Person',
      hashedPassword: 'hashedPassword',
      isEmailVerified: false,
    });
    (mockPersonRepository.findOneMatched as jest.Mock).mockResolvedValueOnce(person);

    await expect(useCase.process(input)).rejects.toThrow(new DomainError('Email is not verified!'));
  });

  it('should call sendEmailResetPassword with correct parameters', async () => {
    const input: ForgotPasswordInput = { email: 'test@example.com' };
    const person = createMockPerson({
      id: 'person-id',
      email: 'test@example.com',
      firstname: 'Test',
      lastname: 'Person',
      hashedPassword: 'hashedPassword',
      isEmailVerified: true,
    });
    (mockPersonRepository.findOneMatched as jest.Mock).mockResolvedValueOnce(person);
    (mockPersonRepository.save as jest.Mock).mockResolvedValueOnce(person);

    await useCase.process(input);

    const code = person.resetPasswordCode;
    const expectedTemplate = getSendResetPasswordEmailParams({ code: code!, email: person.email });
    expect(mockEmailService.sendMail).toHaveBeenCalledWith(expectedTemplate);
  });
});
