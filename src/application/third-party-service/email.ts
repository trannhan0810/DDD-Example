export abstract class EmailTemplate {}

export abstract class EmailService {
  abstract sendMail(email: string, content: EmailTemplate): string;
}
