export abstract class IEmailTemplate<T> {
  abstract subject: string;
  abstract htmlContent(data: T): string;
  abstract textContent(data: T): string;
}

export abstract class IEmailService {
  abstract sendMail<T>(params: { from?: string; to: string; template: IEmailTemplate<T>; data: T }): Promise<void>;
}
