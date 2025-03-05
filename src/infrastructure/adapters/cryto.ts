import { createHash } from 'crypto';

import { ICryptoService } from '@application/common/cryto';
import { Global, Injectable, Module } from '@nestjs/common';

@Injectable()
export class CryptoService implements ICryptoService {
  hash(str: string): string {
    const hash = createHash('sha256');
    hash.update(str);
    return hash.digest('base64');
  }
}

@Global()
@Module({
  providers: [{ useClass: CryptoService, provide: ICryptoService }],
  exports: [ICryptoService],
})
export class CryptoModule {}
