import { IJwtService } from '@application/common/jwt';
import { GetMeResponse } from '@application/dtos/auth/get-me.dto';

export class GetMeUseCase {
  constructor(private readonly jwtService: IJwtService) {}

  async process(input: { accessToken: string }): Promise<GetMeResponse> {
    const user = await this.jwtService.verifyToken(input.accessToken);
    return { ...user };
  }
}
