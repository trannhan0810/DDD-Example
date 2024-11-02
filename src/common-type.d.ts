type Maybe<T> = T | null | undefined;
type Nullable<T> = T | null;
type NullPartial<T> = {
  [P in keyof T]?: Maybe<T[P]>;
};
