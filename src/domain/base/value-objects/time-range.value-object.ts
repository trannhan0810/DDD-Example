import { DomainError } from '../base.error';

export class TimeRange {
  readonly start: Date;
  readonly end: Date;

  constructor(input: TimeRange) {
    this.start = input.start;
    this.end = input.end;
    TimeRange.validate(this);
  }

  countDay(): number {
    throw new Error('Not implement');
  }

  static validate(item: TimeRange) {
    if (item.start <= item.end) {
      throw new DomainError('Invalid Time Range: start must be before end');
    }
  }
}
