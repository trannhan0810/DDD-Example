import { GetMeUseCase } from './get-me.use-case';

import { IJwtService } from '@application/common/jwt';
import { GetMeResponse } from '@application/dtos/auth/get-me.dto';
import { mock } from 'jest-mock-extended';

describe('GetMeUseCase', () => {
  let useCase: GetMeUseCase;
  const mockJwtService = mock<IJwtService>();

  beforeEach(() => {
    useCase = new GetMeUseCase(mockJwtService);
  });

  it('should successfully get person data', async () => {
    const mockPerson: GetMeResponse = {
      id: 'person-id',
      email: 'person@example.com',
      firstname: 'Firstname',
      lastname: 'Lastname',
      roles: [],
    };
    (mockJwtService.verifyToken as jest.Mock).mockResolvedValueOnce(mockPerson);
    const accessToken = 'valid-token';

    const result = await useCase.process({ accessToken });

    expect(result).toEqual(mockPerson);
    expect(mockJwtService.verifyToken).toHaveBeenCalledWith(accessToken);
  });

  it('should throw an error if jwtService.verifyToken throws an error', async () => {
    const expectedError = new Error('Invalid token');
    (mockJwtService.verifyToken as jest.Mock).mockRejectedValueOnce(expectedError);
    const accessToken = 'invalid-token';

    await expect(useCase.process({ accessToken })).rejects.toThrow(expectedError);
  });
});
