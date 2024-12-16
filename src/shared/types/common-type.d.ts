/* eslint-disable @typescript-eslint/no-explicit-any */

type Id = number | string;
type Maybe<T> = T | null | undefined;
type Nullable<T> = T | null;
type NullPartial<T> = {
  [P in keyof T]?: Maybe<T[P]>;
};

type ClassType<T> = { new (...args: any[]): T };
