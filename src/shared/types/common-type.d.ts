/* eslint-disable @typescript-eslint/no-explicit-any */

type Id = number | string;
type Maybe<T> = T | null | undefined;
type Nullable<T> = T | null;
type NullPartial<T> = {
  [P in keyof T]?: Maybe<T[P]>;
};
type IsUndefined<T> = Exclude<T, undefined> extends never ? true : false;

type ClassType<T> = { new (...args: any[]): T };
type Prettier<T> = { [K in keyof T]: T[K] } & {};
type CompactObj<T> = { [K in keyof T as IsUndefined<T[K]> extends true ? never : K]: T[K] };

type FunctionLike<Params = unknown[], Response = unknown> = (...args: Params) => Response;
type ObjectLike<T> = Pick<T, { [K in keyof T]: T[K] extends FunctionLike ? never : K }[keyof T]>;
