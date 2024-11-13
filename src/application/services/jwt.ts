export class JwtPayload {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly roles: string[],
  ) {}
  iat: number = Date.now() / 1000;
  exp: number = 0;

  organization?: string;
  department?: string;
  customClaims?: Record<string, unknown>;
}

export interface IJwtService {
  generateToken(payload: JwtPayload, expiresIn?: string | number): Promise<string>;
  verifyToken(token: string): Promise<JwtPayload>;
  decodeToken(token: string): JwtPayload | null;
}
