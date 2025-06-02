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

export function isSastifyFilter<T extends FilterableType>(value: T, filter: Partial<CommonFilter<T>> = {}) {
  return (
    (filter.$in ? filter.$in.some(item => item == value) : true) &&
    (filter.$nin ? !filter.$nin.some(item => item == value) : true) &&
    (filter.$like ? typeof value === 'string' && value.includes(filter.$like) : true) &&
    (filter.$gt ? value > filter.$gt : true) &&
    (filter.$lt ? value < filter.$lt : true) &&
    (filter.$gte ? value >= filter.$gte : true) &&
    (filter.$lte ? value <= filter.$lte : true)
  );
}

export type IdFilter = Partial<Pick<CommonFilter<Id>, '$in' | '$nin'>>;
export type BooleanFilter = Partial<CompactObj<CommonFilter<boolean>>>;
export type StringFilter = Partial<CompactObj<CommonFilter<string>>>;
export type NumberFilter = Partial<CompactObj<CommonFilter<number>>>;
export type DateFilter = Partial<CompactObj<CommonFilter<Date>>>;
