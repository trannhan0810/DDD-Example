type FilterableType = string | number | boolean | Date | Id;

type CommonFilter<T extends FilterableType> = {
  $in: Extract<string | number | boolean | Date, T>[];
  $nin: Extract<string | number | boolean | Date, T>[];
  $like: Extract<string, T>;
  $gt: Extract<number | Date, T>;
  $lt: Extract<number | Date, T>;
  $gte: Extract<number | Date, T>;
  $lte: Extract<number | Date, T>;
};

export function isSastifyFilter<T extends FilterableType>(
  value: Maybe<T>,
  filter: Partial<CommonFilter<T>> | T[] | T = {},
) {
  if (Array.isArray(filter)) return filter.some(item => item === value);
  if (typeof filter !== 'object' || filter instanceof Date) return filter === value;
  return (
    (filter.$in ? filter.$in.some(item => item === value) : true) &&
    (filter.$nin ? !filter.$nin.some(item => item === value) : true) &&
    (filter.$like ? typeof value === 'string' && value.includes(filter.$like) : true) &&
    (filter.$gt ? value != null && value > filter.$gt : true) &&
    (filter.$lt ? value != null && value < filter.$lt : true) &&
    (filter.$gte ? value != null && value >= filter.$gte : true) &&
    (filter.$lte ? value != null && value <= filter.$lte : true)
  );
}

export type IdFilter = Partial<Pick<CommonFilter<Id>, '$in' | '$nin'>> | Id[] | Id;
export type BooleanFilter = Partial<CompactObj<CommonFilter<boolean>>> | boolean[] | boolean;
export type StringFilter = Partial<CompactObj<CommonFilter<string>>> | string[] | string;
export type NumberFilter = Partial<CompactObj<CommonFilter<number>>> | number[] | number;
export type DateFilter = Partial<CompactObj<CommonFilter<Date>>> | Date[] | Date;
