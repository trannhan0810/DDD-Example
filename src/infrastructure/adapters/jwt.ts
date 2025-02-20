import { IJwtService, JwtPayload } from '@application/services/common/jwt';
import { Global, Injectable, Module } from '@nestjs/common';
import jwt from 'jsonwebtoken';

export const JWT_SECRET: string = '1234';

@Injectable()
export class JwtService extends IJwtService {
  /** expiresIn: expire time in millisecond */
  async generateToken(payload: JwtPayload, expiresIn?: number): Promise<string> {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      return decoded;
    } catch {
      throw new Error('Verify token fail');
    }
  }

  decodeToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.decode(token, { complete: true }) as jwt.JwtPayload;
      return decoded.payload as JwtPayload;
    } catch {
      throw new Error('Decode token fail');
    }
  }
}

@Global()
@Module({
  providers: [{ useClass: JwtService, provide: IJwtService }],
  exports: [IJwtService],
})
export class JwtModule {}
