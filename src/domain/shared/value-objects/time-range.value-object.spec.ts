import { TimeRange } from './time-range.value-object';
import { DomainError } from '../common/base.error';

import { DateTimeUtils } from 'src/shared/utils/date-time.util';

import type { ITimeRange } from './time-range.value-object';

// Mock DateTimeUtils to control its behavior during tests
jest.mock('src/shared/utils/date-time.util', () => ({
  DateTimeUtils: {
    countWeekdays: jest.fn(),
  },
}));

describe('TimeRange', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create a TimeRange instance with valid start and end dates', () => {
      const start = new Date('2023-10-26T00:00:00.000Z');
      const end = new Date('2023-10-27T00:00:00.000Z');
      const timeRange = new TimeRange({ start, end });

      expect(timeRange.start).toEqual(start);
      expect(timeRange.end).toEqual(end);
    });

    it('should throw DomainError if start date is after end date', () => {
      const start = new Date('2023-10-27T00:00:00.000Z');
      const end = new Date('2023-10-26T00:00:00.000Z');

      expect(() => new TimeRange({ start, end })).toThrow(
        new DomainError('Invalid Time Range: start must be before end'),
      );
    });
  });

  describe('countDay', () => {
    it('should call DateTimeUtils.countWeekdays with start and end dates', () => {
      const start = new Date('2023-10-26T00:00:00.000Z');
      const end = new Date('2023-10-27T00:00:00.000Z');
      const timeRange = new TimeRange({ start, end });

      const mockCountWeekdays = DateTimeUtils.countWeekdays as jest.Mock;
      mockCountWeekdays.mockReturnValue(2);

      const result = timeRange.countDay();

      expect(mockCountWeekdays).toHaveBeenCalledWith(start, end);
      expect(result).toBe(2);
    });
  });

  describe('validate', () => {
    it('should not throw an error if start is before or equal to end', () => {
      const start = new Date('2023-10-26T00:00:00.000Z');
      const end = new Date('2023-10-27T00:00:00.000Z');
      const validTimeRange = new TimeRange({ start, end });
      expect(() => TimeRange.validate(validTimeRange)).not.toThrow();

      const sameDate = new Date('2023-10-26T00:00:00.000Z');
      const sameTimeRange = new TimeRange({ start: sameDate, end: sameDate });
      expect(() => TimeRange.validate(sameTimeRange)).not.toThrow();
    });

    it('should throw DomainError if start is after end', () => {
      const start = new Date('2023-10-27T00:00:00.000Z');
      const end = new Date('2023-10-26T00:00:00.000Z');
      const invalidTimeRange: ITimeRange = { start, end };
      expect(() => TimeRange.validate(invalidTimeRange)).toThrow(
        new DomainError('Invalid Time Range: start must be before end'),
      );
    });
  });
});
