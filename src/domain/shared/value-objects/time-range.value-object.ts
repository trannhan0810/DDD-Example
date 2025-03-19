import { DomainError } from '../../base/base.error';

import { DateTimeUtils } from 'src/shared/utils/date-time.util';

export abstract class ITimeRange {
  constructor(
    // ============== //
    public readonly start: Date,
    public readonly end: Date,
  ) {}
}

export class TimeRange extends ITimeRange {
  constructor(input: ITimeRange) {
    super(input.start, input.end);
    TimeRange.validate(this);
  }

  countDay(): number {
    return DateTimeUtils.countWeekdays(this.start, this.end);
  }

  static validate(item: ITimeRange) {
    if (!(new Date(item.start) <= new Date(item.end))) {
      throw new DomainError('Invalid Time Range: start must be before end');
    }
  }
}
