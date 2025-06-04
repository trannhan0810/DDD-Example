/* eslint-disable @typescript-eslint/no-explicit-any */
type Id = number | string;
type ObjectLiteral = Record<string, any>;

/** Maping types */
type Maybe<T> = T | null | undefined;
type Nullable<T> = T | null;
type NullPartial<T> = { [K in keyof T]?: Maybe<T[K]> };
type ClassType<T> = { new (...args: any[]): T };

/** Boolean condition type */
type IsAsignableBy<T, K> = Exclude<T, K> extends never ? true : false;
type FunctionLike<Params = unknown[], Result = unknown> = (...args: Params) => Result;
type ObjectLike<T> = Pick<T, { [K in keyof T]: T[K] extends FunctionLike ? never : K }[keyof T]>;

/** Misc */
type Prettier<T> = { [K in keyof T]: T[K] } & {};
type CompactObj<T> = { [K in keyof T as IsAsignableBy<T[K], undefined> extends true ? never : K]: T[K] };
