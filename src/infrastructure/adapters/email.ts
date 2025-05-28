import { IEmailSender } from '@application/common/email/email-sender';
import { Global, Injectable, Module } from '@nestjs/common';

import type { IEmailTemplate } from '@application/common/email/email-sender';

@Injectable()
export class EmailService implements IEmailSender {
  async sendEmail<T>(params: { from?: string; to: string; template: IEmailTemplate<T>; data: T }): Promise<void> {
    return void params;
  }
}

@Global()
@Module({
  providers: [{ useClass: EmailService, provide: IEmailSender }],
  exports: [IEmailSender],
})
export class EmailModule {}
