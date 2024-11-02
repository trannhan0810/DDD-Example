export type CommonMatcher<T> = {
  includeNull: boolean;
  equal: T;
  notEqual: T;
  isIn: T[];
  notIn: T[];
};

export type BooleanMatcher = CommonMatcher<boolean>;

export type StringMatcher = CommonMatcher<string> & {
  like: string;
  startWith: string;
  endWith: string;
};

export type NumberMatcher = CommonMatcher<number> & {
  gt: number;
  lt: number;
  gte: number;
  lte: number;
};

export type DateMatcher = CommonMatcher<Date> & {
  gt: Date;
  lt: Date;
  gte: Date;
  lte: Date;
};
