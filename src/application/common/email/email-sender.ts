export type SendEmailInput<T> = {
  from?: string;
  to: string;
  template: IEmailTemplate<T>;
  data: T;
};

export abstract class IEmailTemplate<T> {
  abstract subject: string;
  abstract htmlContent(data: T): string;
}

export abstract class IEmailSender {
  abstract sendEmail<T>(params: SendEmailInput<T>): Promise<void>;
}
