export class JwtPayload {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly firstname: string,
    public readonly lastname: string,
    public readonly roles: string[],
  ) {}
  iat: number = Date.now() / 1000;

  organization?: string;
  department?: string;
  customClaims?: Record<string, unknown>;
}

export abstract class IJwtService {
  abstract generateToken(payload: JwtPayload, expiresIn?: string | number): Promise<string>;
  abstract verifyToken(token: string): Promise<JwtPayload>;
}
