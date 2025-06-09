import { DateTimeUnit, DateTimeUtils, DurationConverter, WeekDays } from './date-time.util'; // Adjust path

import type { Duration, DurationInput } from './date-time.util';

describe('DateTimeUtils', () => {
  describe('fromDate', () => {
    it('should create a DateTimeUtils instance from a Date object', () => {
      const date = new Date('2024-03-15T10:00:00.000Z');
      const dateTimeUtils = DateTimeUtils.fromDate(date);
      expect(dateTimeUtils).toBeInstanceOf(DateTimeUtils);
      expect(dateTimeUtils.toDate()).toEqual(date);
    });
  });

  describe('parse', () => {
    it('should create a DateTimeUtils instance from a date string and timezone', () => {
      const dateStr = '2024-03-15T10:00:00.000Z';
      const tz = 'UTC';
      const dateTimeUtils = DateTimeUtils.parse(dateStr, tz);
      expect(dateTimeUtils).toBeInstanceOf(DateTimeUtils);
      expect(dateTimeUtils.format()).toEqual(dateStr);
    });
  });

  describe('toDate', () => {
    it('should return a Date object', () => {
      const dateTimeUtils = DateTimeUtils.parse('2024-03-15T10:00:00.000Z', 'UTC');
      const date = dateTimeUtils.toDate();
      expect(date).toBeInstanceOf(Date);
    });
  });

  describe('clone', () => {
    it('should create a new DateTimeUtils instance with the same date and time', () => {
      const dateTimeUtils = DateTimeUtils.parse('2024-03-15T10:00:00.000Z', 'UTC');
      const clonedDateTimeUtils = dateTimeUtils.clone();

      expect(clonedDateTimeUtils).toBeInstanceOf(DateTimeUtils);
      expect(clonedDateTimeUtils.toDate()).toEqual(dateTimeUtils.toDate());
    });
  });

  describe('add', () => {
    it('should add the duration to the DateTimeUtils instance', () => {
      const dateTimeUtils = DateTimeUtils.parse('2024-03-15T10:00:00.000Z', 'UTC');
      const duration: DurationInput = { years: 1, months: 2, days: 3, hours: 4, minutes: 5, seconds: 6, millis: 7 };
      const newDateTimeUtils = dateTimeUtils.add(duration);
      expect(newDateTimeUtils).toBe(dateTimeUtils); // Should return the same instance
      expect(newDateTimeUtils.format()).toEqual('2025-05-18T14:05:06.007Z');
    });
  });

  describe('truncate', () => {
    it('should truncate the DateTimeUtils instance to the specified unit', () => {
      const dateTimeUtils = DateTimeUtils.parse('2024-03-15T10:30:45.123Z', 'UTC');
      const truncatedDateTimeUtils = dateTimeUtils.truncate(DateTimeUnit.minute);
      expect(truncatedDateTimeUtils.format()).toEqual('2024-03-15T10:30:00.000Z');
    });
  });

  describe('diff', () => {
    it('should return the difference between two dates', () => {
      const date1 = new Date('2024-03-15T10:00:00.000Z');
      const date2 = new Date('2024-03-15T12:30:45.123Z');
      const diff = DateTimeUtils.diff(date2, date1);
      const expectResult: Duration = { hours: 2, minutes: 30, seconds: 45, millis: 123 };
      expect(diff).toEqual(expectResult);
    });

    it('should return the difference between two dates truncated to the specified unit', () => {
      const date1 = new Date('2024-03-15T10:00:00.000Z');
      const date2 = new Date('2024-03-15T12:30:45.123Z');
      const diff = DateTimeUtils.diff(date2, date1, DateTimeUnit.minute);
      const expectResult: Duration = { hours: 2, minutes: 30, seconds: 0, millis: 0 };
      expect(diff).toEqual(expectResult);
    });
  });

  describe('format', () => {
    it('should format the DateTimeUtils instance to the specified timezone', () => {
      const dateTimeUtils = DateTimeUtils.parse('2024-03-15T10:00:00.000Z', 'UTC');
      const formattedDate = dateTimeUtils.format('America/New_York');
      // The exact output might vary slightly depending on Luxon version and system settings.
      expect(formattedDate).toMatch(/2024-03-15T06:00:00.*-04:00/); // Example: 2024-03-15T06:00:00.000-04:00
    });

    it('should return Invalid Date when the date format is invalid', () => {
      const dateTimeUtils = DateTimeUtils.parse('Invalid date');
      const formattedDate = dateTimeUtils.format('America/New_York');
      expect(formattedDate).toEqual('Invalid Date');
    });
  });

  describe('countWeekdays', () => {
    it('should count weekdays between two dates including weekends', () => {
      const startDate = new Date('2024-03-11T00:00:00.000Z'); // Monday
      const endDate = new Date('2024-03-17T00:00:00.000Z'); // Sunday
      const count = DateTimeUtils.countWeekdays(startDate, endDate);
      expect(count).toBe(7);
    });

    it('should count specific weekdays between two dates', () => {
      const startDate = new Date('2024-03-11T00:00:00.000Z'); // Monday
      const endDate = new Date('2024-03-17T00:00:00.000Z'); // Sunday
      const count = DateTimeUtils.countWeekdays(startDate, endDate, [WeekDays.Monday, WeekDays.Friday]);
      expect(count).toBe(2);
    });

    it('should throw an error if the end date is before the start date', () => {
      const startDate = new Date('2024-03-17T00:00:00.000Z'); // Sunday
      const endDate = new Date('2024-03-11T00:00:00.000Z'); // Monday
      expect(() => DateTimeUtils.countWeekdays(startDate, endDate)).toThrowError('Invalid Date range');
    });

    it('should count weekdays correctly even when the dates span multiple weeks', () => {
      const startDate = new Date('2024-03-04T00:00:00.000Z'); // Monday
      const endDate = new Date('2024-03-24T00:00:00.000Z'); // Sunday
      const count = DateTimeUtils.countWeekdays(startDate, endDate);
      expect(count).toBe(21);
    });
  });
});

describe('DurationConverter', () => {
  describe('toMilliseconds', () => {
    it('should convert the duration to milliseconds', () => {
      const duration: Duration = { hours: 1, minutes: 30, seconds: 45, millis: 123 };
      const converter = new DurationConverter(duration);
      const milliseconds = converter.toMilliseconds();
      expect(milliseconds).toBe(5445123);
    });

    it('should handle zero duration correctly', () => {
      const duration: Duration = { hours: 0, minutes: 0, seconds: 0, millis: 0 };
      const converter = new DurationConverter(duration);
      const milliseconds = converter.toMilliseconds();
      expect(milliseconds).toBe(0);
    });

    it('should handle durations with only some units populated', () => {
      const duration1: Duration = { hours: 2 };
      const converter1 = new DurationConverter(duration1);
      const milliseconds1 = converter1.toMilliseconds();
      expect(milliseconds1).toBe(7200000);

      const duration2: Duration = { days: 1, minutes: 30, seconds: 15, millis: 0 };
      const converter2 = new DurationConverter(duration2);
      const milliseconds2 = converter2.toMilliseconds();
      expect(milliseconds2).toBe(88215000);

      const duration3: Duration = { millis: 500 };
      const converter3 = new DurationConverter(duration3);
      const milliseconds3 = converter3.toMilliseconds();
      expect(milliseconds3).toBe(500);
    });
  });

  describe('toDecimal', () => {
    it('should convert the duration to a decimal value for the specified unit (hours)', () => {
      const duration: Duration = { hours: 1, minutes: 30, seconds: 0, millis: 0 };
      const converter = new DurationConverter(duration);
      const decimalValue = converter.toDecimal(DateTimeUnit.hour);
      expect(decimalValue).toBe(1.5);
    });

    it('should convert the duration to a decimal value for the specified unit (minutes)', () => {
      const duration: Duration = { hours: 1, minutes: 30, seconds: 0, millis: 0 };
      const converter = new DurationConverter(duration);
      const decimalValue = converter.toDecimal(DateTimeUnit.minute);
      expect(decimalValue).toBe(90);
    });

    it('should convert the duration to a decimal value for the specified unit (seconds)', () => {
      const duration: Duration = { hours: 0, minutes: 2, seconds: 30, millis: 0 };
      const converter = new DurationConverter(duration);
      const decimalValue = converter.toDecimal(DateTimeUnit.second);
      expect(decimalValue).toBe(150);
    });

    it('should convert the duration to a decimal value for the specified unit (days)', () => {
      const duration: Duration = { hours: 24, minutes: 0, seconds: 0, millis: 0 };
      const converter = new DurationConverter(duration);
      const decimalValue = converter.toDecimal(DateTimeUnit.day);
      expect(decimalValue).toBe(1);
    });

    it('should convert the duration to a decimal value for the specified unit (milliseconds)', () => {
      const duration: Duration = { hours: 0, minutes: 0, seconds: 0, millis: 500 };
      const converter = new DurationConverter(duration);
      const decimalValue = converter.toDecimal(DateTimeUnit.millis);
      expect(decimalValue).toBe(500);
    });

    it('should handle zero duration correctly', () => {
      const duration: Duration = { hours: 0, minutes: 0, seconds: 0, millis: 0 };
      const converter = new DurationConverter(duration);
      const decimalValue = converter.toDecimal(DateTimeUnit.hour);
      expect(decimalValue).toBe(0);
    });
  });
});
