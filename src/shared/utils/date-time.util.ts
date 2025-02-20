import { DateTime, Duration as LuxonDuration } from 'luxon';

type IANATimeZone = `${string}/${string}` | 'UTC';

type Duration = {
  hour: number;
  minute: number;
  second: number;
  millis: number;
};

type DateTimeAddDuration = Duration & {
  day: number;
  year: number;
  month: number;
};

export enum DateTimeUnit {
  year = 'Y',
  month = 'M',
  day = 'D',
  hour = 'h',
  minute = 'm',
  second = 's',
  millis = 'ms',
}

export type DurationUnit =
  | DateTimeUnit.day
  | DateTimeUnit.hour
  | DateTimeUnit.minute
  | DateTimeUnit.second
  | DateTimeUnit.millis;

export enum WeekDays {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export class DateTimeUtils {
  private dateTime: DateTime;

  private constructor(dateTime: DateTime) {
    this.dateTime = dateTime;
  }

  static fromDate(date: Date): DateTimeUtils {
    return new DateTimeUtils(DateTime.fromJSDate(date));
  }

  static parse(dateStr: string, tz: IANATimeZone): DateTimeUtils {
    return new DateTimeUtils(DateTime.fromISO(dateStr, { zone: tz }));
  }

  toDate(): Date {
    return this.dateTime.toJSDate();
  }

  clone(): DateTimeUtils {
    return new DateTimeUtils(this.dateTime);
  }

  add(duration: DateTimeAddDuration): this {
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

  diff(other: Date, truncate: DateTimeUnit = DateTimeUnit.millis): Duration {
    const thisDate = this.clone().truncate(truncate).dateTime;
    const otherDateTime = DateTimeUtils.fromDate(other).truncate(truncate).dateTime;
    const luxonDuration = thisDate.diff(otherDateTime, ['hours', 'minutes', 'seconds', 'milliseconds']);

    return {
      hour: luxonDuration.hours,
      minute: luxonDuration.minutes,
      second: luxonDuration.seconds,
      millis: luxonDuration.milliseconds,
    };
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

    if (countedWeekdays == null) countedWeekdays = Object.values(WeekDays) as WeekDays[];
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
  millisPerUnit = {
    [DateTimeUnit.day]: 86400000, // 24 * 60 * 60 * 1000
    [DateTimeUnit.hour]: 3600000, // 60 * 60 * 1000
    [DateTimeUnit.minute]: 60000, // 60 * 1000
    [DateTimeUnit.second]: 1000,
    [DateTimeUnit.millis]: 1,
  };

  private duration: Duration;

  constructor(duration: Duration) {
    this.duration = duration;
  }

  toMilliseconds(): number {
    return (
      this.duration.hour * this.millisPerUnit[DateTimeUnit.hour] +
      this.duration.minute * this.millisPerUnit[DateTimeUnit.minute] +
      this.duration.second * this.millisPerUnit[DateTimeUnit.second] +
      this.duration.millis
    );
  }

  toDecimal(unit: DurationUnit): number {
    return this.toMilliseconds() / this.millisPerUnit[unit];
  }
}
