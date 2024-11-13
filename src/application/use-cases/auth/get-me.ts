import type { IJwtService } from '@application/services/jwt';

export type GetMeInput = {
  accessToken: string;
};

export type GetMeResponse = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
};

export class GetMeUseCase {
  constructor(private readonly jwtService: IJwtService) {}

  async process(input: GetMeInput): Promise<GetMeResponse> {
    const user = await this.jwtService.verifyToken(input.accessToken);
    return user;
  }
}
