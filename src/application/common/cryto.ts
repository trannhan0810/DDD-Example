export abstract class ICryptoService {
  abstract hashPasswordSync(password: string): string;
  abstract hashPassword(password: string): Promise<string>;
  abstract comparePassword(password: string, hashedPassword: string): Promise<boolean>;
}
