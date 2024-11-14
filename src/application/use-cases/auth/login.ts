import { JwtPayload } from '@application/services/jwt';
import { DomainError } from '@domain/base/base.error';

import type { CryptoService } from '@application/services/cryto';
import type { IJwtService } from '@application/services/jwt';
import type { User } from '@domain/user-management/user/user.entity';
import type { UserRepository } from '@domain/user-management/user/user.repository';
import type { UserSpecificationFactory } from '@domain/user-management/user/user.specification';

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export class LoginUseCase {
  constructor(
    private readonly userSpecFactory: UserSpecificationFactory,
    private readonly userRepository: UserRepository,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: IJwtService,
  ) {}

  async process(input: LoginInput): Promise<LoginResponse> {
    const hashedPassword = this.cryptoService.hash(input.password);

    const isEmailMatchedSpec = this.userSpecFactory.isEmailMatched(input.email);
    const isPasswordMatchedSpec = this.userSpecFactory.isPasswordMatched(hashedPassword);
    const isEmailAndPasswordCorrectSpec = isEmailMatchedSpec.and(isPasswordMatchedSpec);

    const user = await this.userRepository.findOneMatched(isEmailAndPasswordCorrectSpec);
    if (!user) throw new DomainError('Email or password is incorrect');

    return this.generateToken(user);
  }

  private async generateToken(user: User): Promise<LoginResponse> {
    const payload = new JwtPayload(`${user.id}`, user.email, user.firstname, user.lastname, []);
    const accessToken = await this.jwtService.generateToken(payload);
    const refreshToken = await this.jwtService.generateToken(payload);
    return { accessToken, refreshToken };
  }
}
