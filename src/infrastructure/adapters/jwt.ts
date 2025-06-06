import { IJwtService, JwtPayload } from '@application/common/jwt';
import { Global, Injectable, Module } from '@nestjs/common';
import jwt from 'jsonwebtoken';

export const JWT_SECRET: string = '1234';
export const MILLS_PER_MINUTE: number = 60 * 1000;

@Injectable()
export class JwtService extends IJwtService {
  /** expiresIn: expire time in millisecond */
  async generateToken(payload: JwtPayload, expiresIn: number = 5 * MILLS_PER_MINUTE): Promise<string> {
    return jwt.sign(JSON.parse(JSON.stringify(payload)), JWT_SECRET, { expiresIn });
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      return decoded;
    } catch {
      throw new Error('Verify token fail');
    }
  }
}

@Global()
@Module({
  providers: [{ useClass: JwtService, provide: IJwtService }],
  exports: [IJwtService],
})
export class JwtModule {}
