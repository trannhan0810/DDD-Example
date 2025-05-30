import { ICryptoService } from '@application/common/cryto';
import { IJwtService, JwtPayload } from '@application/common/jwt';
import { LoginInput, LoginResponse } from '@application/dtos/auth/login.dto';
import { Person } from '@domain/person-management/entities/person.entity';
import { PersonRepository } from '@domain/person-management/respositories/person.repository';
import { DomainError } from '@domain/shared/common/base.error';

export class LoginUseCase {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly cryptoService: ICryptoService,
    private readonly jwtService: IJwtService,
  ) {}

  async process(input: LoginInput): Promise<LoginResponse> {
    const person = await this.personRepository.findOneMatched({
      email: { isIn: [input.email] },
    });
    const hashedPassword = this.cryptoService.hash(input.password);
    if (!person || person.hashedPassword !== hashedPassword) {
      throw new DomainError('Email or password is incorrect');
    }

    return this.generateToken(person);
  }

  private async generateToken(person: Person): Promise<LoginResponse> {
    const payload = new JwtPayload(`${person.id}`, person.email, person.firstname, person.lastname, []);
    const accessToken = await this.jwtService.generateToken(payload);
    const refreshToken = await this.jwtService.generateToken(payload);
    return { accessToken, refreshToken };
  }
}
