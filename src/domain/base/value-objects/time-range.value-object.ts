import { DomainError } from '../base.error';

export class TimeRange {
  readonly start: Date;
  readonly end: Date;

  constructor(input: { start: Date; end: Date }) {
    this.start = input.start;
    this.end = input.end;
    TimeRange.validate(this);
  }

  countDay(): number {
    const start = new Date(this.start).setUTCHours(0);
    const end = new Date(this.end).setUTCHours(0);
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const diffInMilliseconds = end - start;
    return Math.ceil(diffInMilliseconds / oneDayInMilliseconds) + 1;
  }

  static validate(item: TimeRange) {
    if (!(item.start <= item.end)) {
      throw new DomainError('Invalid Time Range: start must be before end');
    }
  }
}
