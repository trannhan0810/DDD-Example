export class DomainError {
  constructor(private message: string) {}
  toString() {
    return this.message;
  }
}
