import { DateTime, Duration as LuxonDuration } from 'luxon';

export enum DateTimeUnit {
  year = 'Y',
  month = 'M',
  day = 'D',
  hour = 'h',
  minute = 'm',
  second = 's',
  millis = 'ms',
}

export enum WeekDays {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

const MILLS_PER_UNIT = {
  [DateTimeUnit.day]: 86400000, // 24 * 60 * 60 * 1000
  [DateTimeUnit.hour]: 3600000, // 60 * 60 * 1000
  [DateTimeUnit.minute]: 60000, // 60 * 1000
  [DateTimeUnit.second]: 1000,
  [DateTimeUnit.millis]: 1,
};

type IANATimeZone = `${string}/${string}` | 'UTC';

type DurationInput = {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
  millis?: number;
};

export type Duration = Pick<DurationInput, 'day' | 'hour' | 'minute' | 'second' | 'millis'>;

export type DurationUnit =
  | DateTimeUnit.day
  | DateTimeUnit.hour
  | DateTimeUnit.minute
  | DateTimeUnit.second
  | DateTimeUnit.millis;

export class DateTimeUtils {
  private dateTime: DateTime;

  private constructor(dateTime: DateTime) {
    this.dateTime = dateTime;
  }

  static fromDate(date: Date): DateTimeUtils {
    return new DateTimeUtils(DateTime.fromJSDate(date));
  }

  static parse(dateStr: string, tz: IANATimeZone = 'UTC'): DateTimeUtils {
    return new DateTimeUtils(DateTime.fromISO(dateStr, { zone: tz }));
  }

  /** Return the duration need to add to make current datetime become other */
  static diff(endDate: Date, startDate: Date, truncate: DateTimeUnit = DateTimeUnit.millis): Duration {
    const end = DateTimeUtils.fromDate(endDate).truncate(truncate).dateTime;
    const start = DateTimeUtils.fromDate(startDate).truncate(truncate).dateTime;
    const luxonDuration = end.diff(start, ['hours', 'minutes', 'seconds', 'milliseconds']);

    return {
      hour: luxonDuration.hours,
      minute: luxonDuration.minutes,
      second: luxonDuration.seconds,
      millis: luxonDuration.milliseconds,
    };
  }

  toDate(): Date {
    return this.dateTime.toJSDate();
  }

  clone(): DateTimeUtils {
    return new DateTimeUtils(this.dateTime);
  }

  add(duration: DurationInput): this {
    const luxonDuration = LuxonDuration.fromObject({
      years: duration.year,
      months: duration.month,
      days: duration.day,
      hours: duration.hour,
      minutes: duration.minute,
      seconds: duration.second,
      milliseconds: duration.millis,
    });

    this.dateTime = this.dateTime.plus(luxonDuration);
    return this;
  }

  truncate(unit: DateTimeUnit): this {
    this.dateTime = this.dateTime.startOf(this.getLuxonUnit(unit));
    return this;
  }

  private getLuxonUnit(unit: DateTimeUnit) {
    const unitMap = {
      [DateTimeUnit.year]: 'year',
      [DateTimeUnit.month]: 'month',
      [DateTimeUnit.day]: 'day',
      [DateTimeUnit.hour]: 'hour',
      [DateTimeUnit.minute]: 'minute',
      [DateTimeUnit.second]: 'second',
      [DateTimeUnit.millis]: 'millisecond',
    } as const;
    return unitMap[unit];
  }

  format(tz: IANATimeZone = 'UTC'): string {
    return this.dateTime.setZone(tz).toISO() ?? 'Invalid Date';
  }

  static countWeekdays(startDate: Date, endDate: Date, countedWeekdays?: WeekDays[]): number {
    const startDateTime = DateTime.fromJSDate(startDate).startOf('day');
    const endDateTime = DateTime.fromJSDate(endDate).startOf('day');

    if (endDateTime < startDateTime) {
      throw new Error('Invalid Date range');
    }

    if (countedWeekdays == null) {
      countedWeekdays = [
        WeekDays.Monday,
        WeekDays.Tuesday,
        WeekDays.Wednesday,
        WeekDays.Thursday,
        WeekDays.Friday,
        WeekDays.Saturday,
        WeekDays.Sunday,
      ];
    }

    const countedWeekdaysSet = new Set(countedWeekdays);
    let count = 0;

    // Calculate the number of full weeks
    const daysDifference = endDateTime.diff(startDateTime, 'days').days;
    const fullWeeks = Math.floor(daysDifference / 7);

    // Count weekdays in full weeks
    countedWeekdaysSet.forEach(() => (count += fullWeeks));

    // Count weekdays in the remaining days
    let remainingDate = startDateTime.plus({ days: fullWeeks * 7 });
    while (remainingDate <= endDateTime) {
      if (countedWeekdaysSet.has(remainingDate.weekday % 7)) count++;
      remainingDate = remainingDate.plus({ days: 1 });
    }

    return count;
  }
}

export class DurationConverter {
  constructor(private duration: Duration) {}

  toMilliseconds(): number {
    return (
      (this.duration.day ?? 0) * MILLS_PER_UNIT[DateTimeUnit.day] +
      (this.duration.hour ?? 0) * MILLS_PER_UNIT[DateTimeUnit.hour] +
      (this.duration.minute ?? 0) * MILLS_PER_UNIT[DateTimeUnit.minute] +
      (this.duration.second ?? 0) * MILLS_PER_UNIT[DateTimeUnit.second] +
      (this.duration.millis ?? 0)
    );
  }

  toDecimal(unit: DurationUnit): number {
    return this.toMilliseconds() / MILLS_PER_UNIT[unit];
  }
}
