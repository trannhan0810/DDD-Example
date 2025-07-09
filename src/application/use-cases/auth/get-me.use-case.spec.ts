import { GetMeUseCase } from './get-me.use-case';

import { DomainError } from '@domain/shared/common/base.error';

import { mock } from 'jest-mock-extended';

import type { Person } from '@domain/person-management/entities/person.entity';
import type { PersonRepository } from '@domain/person-management/repositories/person.repository';

describe('GetMeUseCase', () => {
  let useCase: GetMeUseCase;
  const mockPersonRepository = mock<PersonRepository>();

  beforeEach(() => {
    jest.resetAllMocks();
    useCase = new GetMeUseCase(mockPersonRepository);
  });

  it('should return person data with roles if found', async () => {
    const mockPerson = {
      id: 'person-id',
      email: 'person@example.com',
      firstname: 'Firstname',
      lastname: 'Lastname',
      isEmailVerified: true,
      hashedPassword: 'hashed-password',
      resetPasswordCode: null,
      resetPasswordCodeExpireTime: null,
    } as Person;
    mockPersonRepository.findById.mockResolvedValueOnce(mockPerson);

    const result = await useCase.process({ id: 'person-id' });

    expect(result).toEqual({ ...mockPerson, roles: [] });
    expect(mockPersonRepository.findById).toHaveBeenCalledWith('person-id');
  });

  it('should throw DomainError if person not found', async () => {
    mockPersonRepository.findById.mockResolvedValueOnce(undefined);

    await expect(useCase.process({ id: 'not-found-id' })).rejects.toThrow(new DomainError('Person not found!'));
    expect(mockPersonRepository.findById).toHaveBeenCalledWith('not-found-id');
  });
});
