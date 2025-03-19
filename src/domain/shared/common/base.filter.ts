type CommonFilter<T> = {
  isIn: T[];
  notIn: T[];
  like: string;
  gt: number;
  lt: number;
  gte: number;
  lte: number;
};

export type IdFilter = Partial<Pick<CommonFilter<Id>, 'isIn' | 'notIn'>>;
export type BooleanFilter = Partial<Pick<CommonFilter<boolean>, 'isIn' | 'notIn'>>;
export type StringFilter = Partial<Pick<CommonFilter<string>, 'isIn' | 'notIn' | 'like'>>;
export type NumberFilter = Partial<Pick<CommonFilter<number>, 'isIn' | 'notIn' | 'gt' | 'lt' | 'gte' | 'lte'>>;
export type DateFilter = Partial<Pick<CommonFilter<Date>, 'isIn' | 'notIn' | 'gt' | 'lt' | 'gte' | 'lte'>>;
