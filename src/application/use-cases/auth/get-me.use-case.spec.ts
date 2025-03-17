import { GetMeUseCase } from './get-me.use-case';

import { IJwtService } from '@application/common/jwt';
import { GetMeResponse } from '@application/dtos/auth/get-me.dto';

class MockJwtService extends IJwtService {
  generateToken = jest.fn();
  verifyToken = jest.fn();
  decodeToken = jest.fn();
}

describe('GetMeUseCase', () => {
  let useCase: GetMeUseCase;
  const mockJwtService = new MockJwtService();

  beforeEach(() => {
    useCase = new GetMeUseCase(mockJwtService);
  });

  it('should successfully get user data', async () => {
    const mockUser: GetMeResponse = {
      id: 'user-id',
      email: 'user@example.com',
      firstname: 'Firstname',
      lastname: 'Lastname',
      roles: [],
    };
    (mockJwtService.verifyToken as jest.Mock).mockResolvedValueOnce(mockUser);
    const accessToken = 'valid-token';

    const result = await useCase.process({ accessToken });

    expect(result).toEqual(mockUser);
    expect(mockJwtService.verifyToken).toHaveBeenCalledWith(accessToken);
  });

  it('should throw an error if jwtService.verifyToken throws an error', async () => {
    const expectedError = new Error('Invalid token');
    (mockJwtService.verifyToken as jest.Mock).mockRejectedValueOnce(expectedError);
    const accessToken = 'invalid-token';

    await expect(useCase.process({ accessToken })).rejects.toThrow(expectedError);
  });
});
