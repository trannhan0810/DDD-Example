export type SendEmailParams<T> = {
  from?: string;
  to: string;
  template: IEmailTemplate<T>;
  data: T;
};

export abstract class IEmailTemplate<T> {
  abstract subject: string;
  abstract htmlContent(data: T): string;
}

export abstract class IEmailService {
  abstract sendMail<T>(params: SendEmailParams<T>): Promise<void>;
}
