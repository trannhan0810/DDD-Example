import { IJwtService } from '@application/common/jwt';
import { GetMeResponse } from '@application/dtos/auth/get-me.dto';
import { UseCase } from 'src/shared/decorators';

@UseCase()
export class GetMeUseCase {
  constructor(private readonly jwtService: IJwtService) {}

  async process(input: { accessToken: string }): Promise<GetMeResponse> {
    const person = await this.jwtService.verifyToken(input.accessToken);
    return { ...person };
  }
}
