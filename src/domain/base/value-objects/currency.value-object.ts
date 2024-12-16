export class Currency {
  readonly code: string;
  readonly symbol: string;

  constructor(input: Currency) {
    this.code = input.code;
    this.symbol = input.symbol;
  }
}
