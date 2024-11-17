import { UseCase } from '@application/base/decorator';
import { IJwtService } from '@application/services/jwt';

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

@UseCase()
export class GetMeUseCase {
  constructor(private readonly jwtService: IJwtService) {}

  async process(input: GetMeInput): Promise<GetMeResponse> {
    const user = await this.jwtService.verifyToken(input.accessToken);
    return user;
  }
}
