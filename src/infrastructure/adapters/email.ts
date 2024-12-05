import { IEmailService } from '@application/services/common/email/email';
import { Global, Injectable, Module } from '@nestjs/common';

import type { IEmailTemplate } from '@application/services/common/email/email';

@Injectable()
export class EmailService implements IEmailService {
  async sendMail<T>(params: { from?: string; to: string; template: IEmailTemplate<T>; data: T }): Promise<void> {
    return void params;
  }
}

@Global()
@Module({
  providers: [{ useClass: EmailService, provide: IEmailService }],
  exports: [IEmailService],
})
export class EmailModule {}
