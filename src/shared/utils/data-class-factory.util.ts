type UnnknownContructor = ClassType<unknown> | (typeof primaryConstructure)[number];
export const primaryConstructure = [Number, String, Boolean];

export type Schema = Record<string, DataType<unknown, boolean, boolean>>;
export type TypeFromSchema<T extends Schema> = {
  [key in keyof T]: T[key] extends DataType<infer Type, infer Optional, infer Nullable>
    ? Type | (Optional extends true ? undefined : never) | (Nullable extends true ? null : never)
    : never;
};

export class DataType<T, Optional = boolean, Nullable = boolean> {
  private constructor(public type: UnnknownContructor, public isOptional: Optional, public isNullable: Nullable) {}
  validate(value: unknown) {
    if (this.type === Number) return typeof value !== 'number' ? { err: `is not number` } : undefined;
    if (this.type === String) return typeof value !== 'string' ? { err: `is not string` } : undefined;
    if (this.type === Boolean) return typeof value !== 'boolean' ? { err: `is not boolean` } : undefined;
    if (!(value instanceof this.type)) return { err: `is not ${this.type.name}` };
    return undefined;
  }
  static number = () => new DataType(Number, false, false) as DataType<number, false, false>;
  static string = () => new DataType(String, false, false) as DataType<string, false, false>;
  static bool = () => new DataType(Boolean, false, false) as DataType<boolean, false, false>;
  static date = () => new DataType(Date, false, false) as DataType<Date, false, false>;
  static obj = <T>(cls: ClassType<T>) => new DataType(cls, false, false) as DataType<T, false, false>;
  readonly null = () => Object.assign(this, { isNullable: true }) as DataType<T, Optional, true>;
  readonly optional = () => Object.assign(this, { isOptional: true }) as DataType<T, true, Nullable>;
}

export class SchemaValidator {
  static validate(item: Record<string, unknown>, schema: Schema): [valid: boolean, errors: string[]] {
    const errors: string[] = [];
    const thisObj = item as Record<string, unknown>;
    const keys = Object.keys({ ...schema, ...item });
    keys.forEach(key => {
      const value = thisObj[key];
      const config = schema[key];

      if (!config) return errors.push(`object includes unknown key "${key}"`);
      if (value === undefined) return !config.isOptional ? errors.push(`${key} is missing!`) : undefined;
      if (value === null) return !config.isNullable ? errors.push(`${key} is not nullable!`) : undefined;
      const validateTypeErr = config.validate(value);
      if (validateTypeErr) return errors.push(`${key} ${validateTypeErr.err}`);
    });
    const isValid = !errors.length;
    return [isValid, errors];
  }
}

export const DataClassFactory = <T extends Schema = Schema, ResultType = TypeFromSchema<T>>(schema: T) => {
  class NewEntity {
    static schema = schema;

    constructor(input: Partial<ResultType>) {
      Object.assign(this, { ...input });
      this.validate();
    }

    validate(): asserts this is ResultType {
      const schema = this.getSchema();
      const thisObj = this as Record<string, unknown>;
      const [isValid, errors] = SchemaValidator.validate(thisObj, schema);
      if (!isValid || errors.length) {
        throw new Error(`Entity validation failed: ${errors.join(', ')}`);
      }
    }

    getSchema(): Schema {
      return schema;
    }
  }

  return NewEntity as unknown as ClassType<NewEntity & ResultType>;
};
