import { DateTime as LuxonDateTime, Duration as LuxonDuration } from 'luxon';

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

const ALL_WEEK_DAYS = [
  WeekDays.Monday,
  WeekDays.Tuesday,
  WeekDays.Wednesday,
  WeekDays.Thursday,
  WeekDays.Friday,
  WeekDays.Saturday,
  WeekDays.Sunday,
];

const MILLS_PER_UNIT = {
  [DateTimeUnit.day]: 86400000, // 24 * 60 * 60 * 1000
  [DateTimeUnit.hour]: 3600000, // 60 * 60 * 1000
  [DateTimeUnit.minute]: 60000, // 60 * 1000
  [DateTimeUnit.second]: 1000,
  [DateTimeUnit.millis]: 1,
};

type IANATimeZone = `${string}/${string}` | 'UTC';

export interface DurationInput {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  millis?: number;
}

export type Duration = Pick<DurationInput, 'days' | 'hours' | 'minutes' | 'seconds' | 'millis'>;

export type DurationUnit =
  | DateTimeUnit.day
  | DateTimeUnit.hour
  | DateTimeUnit.minute
  | DateTimeUnit.second
  | DateTimeUnit.millis;

export class DateTimeUtils {
  private luxonDate: LuxonDateTime;

  private constructor(dateTime: LuxonDateTime) {
    this.luxonDate = dateTime;
  }

  static fromDate(date: Date): DateTimeUtils {
    return new DateTimeUtils(LuxonDateTime.fromJSDate(date));
  }

  static parse(dateStr: string, tz: IANATimeZone = 'UTC'): DateTimeUtils {
    return new DateTimeUtils(LuxonDateTime.fromISO(dateStr, { zone: tz }));
  }

  /** Return the duration need to add to make current datetime become other */
  static diff(endDate: Date, startDate: Date, truncate: DateTimeUnit = DateTimeUnit.millis): Duration {
    const end = DateTimeUtils.fromDate(endDate).truncate(truncate).luxonDate;
    const start = DateTimeUtils.fromDate(startDate).truncate(truncate).luxonDate;
    const luxonDuration = end.diff(start, ['hours', 'minutes', 'seconds', 'milliseconds']);

    return {
      hours: luxonDuration.hours,
      minutes: luxonDuration.minutes,
      seconds: luxonDuration.seconds,
      millis: luxonDuration.milliseconds,
    };
  }

  toDate(): Date {
    return this.luxonDate.toJSDate();
  }

  clone(): DateTimeUtils {
    return new DateTimeUtils(this.luxonDate);
  }

  add(duration: DurationInput): this {
    const { years, months, days, hours, minutes, seconds, millis: milliseconds } = duration;
    const luxonDuration = LuxonDuration.fromObject({ years, months, days, hours, minutes, seconds, milliseconds });
    this.luxonDate = this.luxonDate.plus(luxonDuration);
    return this;
  }

  truncate(unit: DateTimeUnit): this {
    this.luxonDate = this.luxonDate.startOf(this.getLuxonUnit(unit));
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
    return this.luxonDate.setZone(tz).toISO() ?? 'Invalid Date';
  }

  static countWeekdays(startDate: Date, endDate: Date, countedWeekdays: WeekDays[] = ALL_WEEK_DAYS): number {
    const startDateTime = LuxonDateTime.fromJSDate(startDate).startOf('day');
    const endDateTime = LuxonDateTime.fromJSDate(endDate).startOf('day');
    const countedWeekdaysSet = new Set(countedWeekdays);

    if (!(startDateTime <= endDateTime)) {
      throw new Error('Invalid Date range');
    }

    // Calculate the number of full weeks
    const daysDifference = endDateTime.diff(startDateTime, 'days').days;
    const fullWeeks = Math.floor(daysDifference / 7);
    let count = fullWeeks * countedWeekdaysSet.size;

    // Count weekdays in the remaining days
    for (let day = startDateTime.plus({ days: fullWeeks * 7 }); day <= endDateTime; day = day.plus({ days: 1 })) {
      count += countedWeekdaysSet.has(day.weekday % 7) ? 1 : 0;
    }

    return count;
  }
}

export class DurationConverter {
  constructor(private duration: Duration) {}

  toMilliseconds(): number {
    return (
      (this.duration.days ?? 0) * MILLS_PER_UNIT[DateTimeUnit.day] +
      (this.duration.hours ?? 0) * MILLS_PER_UNIT[DateTimeUnit.hour] +
      (this.duration.minutes ?? 0) * MILLS_PER_UNIT[DateTimeUnit.minute] +
      (this.duration.seconds ?? 0) * MILLS_PER_UNIT[DateTimeUnit.second] +
      (this.duration.millis ?? 0)
    );
  }

  toDecimal(unit: DurationUnit): number {
    return this.toMilliseconds() / MILLS_PER_UNIT[unit];
  }
}
