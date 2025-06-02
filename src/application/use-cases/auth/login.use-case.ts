import { ICryptoService } from '@application/common/cryto';
import { IJwtService, JwtPayload } from '@application/common/jwt';
import { LoginInput, LoginResponse } from '@application/dtos/auth/login.dto';
import { Person } from '@domain/person-management/entities/person.entity';
import { PersonRepository } from '@domain/person-management/repositories/person.repository';
import { DomainError } from '@domain/shared/common/base.error';
import { UseCase } from 'src/shared/decorators';

@UseCase()
export class LoginUseCase {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly cryptoService: ICryptoService,
    private readonly jwtService: IJwtService,
  ) {}

  async process(input: LoginInput): Promise<LoginResponse> {
    const { email } = input;
    const person = await this.personRepository.findOneMatched({ email });
    const hashedPassword = await this.cryptoService.hashPassword(input.password);
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
