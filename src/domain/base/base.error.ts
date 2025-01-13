export class DomainError extends Error {
  constructor(public message: string) {
    super();
  }
  toString() {
    return this.message;
  }
}
