import { scryptSync } from 'crypto';

import { ICryptoService } from '@application/common/cryto';

import { Global, Injectable, Module } from '@nestjs/common';

@Injectable()
export class CryptoService implements ICryptoService {
  SALT = 'default_salt'; // Default salt, can be overridden

  hashPasswordSync(password: string, salt: string = this.SALT): string {
    return scryptSync(password, salt, 64).toString('hex');
  }
  async hashPassword(password: string, salt: string = this.SALT): Promise<string> {
    return this.hashPasswordSync(password, salt);
  }
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return hashedPassword === this.hashPasswordSync(password);
  }
}

@Global()
@Module({
  providers: [{ useClass: CryptoService, provide: ICryptoService }],
  exports: [ICryptoService],
})
export class CryptoModule {}
