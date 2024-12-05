import { LoginInput, LoginResponse } from '@application/dtos/auth/login.dto';
import { ICryptoService } from '@application/services/common/cryto';
import { IJwtService, JwtPayload } from '@application/services/common/jwt';
import { DomainError } from '@domain/base/base.error';
import { User } from '@domain/user-management/entities/user.entity';
import { UserRepository } from '@domain/user-management/user/user.repository';
import { UserEmailMatchedSpec, UserPasswordMatchedSpec } from '@domain/user-management/user/user.specification';

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptoService: ICryptoService,
    private readonly jwtService: IJwtService,
  ) {}

  async process(input: LoginInput): Promise<LoginResponse> {
    const hashedPassword = this.cryptoService.hash(input.password);

    const isEmailMatchedSpec = new UserEmailMatchedSpec(input.email);
    const isPasswordMatchedSpec = new UserPasswordMatchedSpec(hashedPassword);
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
