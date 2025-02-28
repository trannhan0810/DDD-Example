import { DataClassFactory, DataType, SchemaValidator } from './data-class-factory.util'; // Replace with the actual file path

import type { Schema } from './data-class-factory.util';

class TestObject {
  prop1: string;
  prop2: number;

  constructor(prop1: string, prop2: number) {
    this.prop1 = prop1;
    this.prop2 = prop2;
  }
}

describe('DataType', () => {
  it('should create DataType instances with correct types', () => {
    const numberType = DataType.number();
    const stringType = DataType.string();
    const boolType = DataType.bool();
    const dateType = DataType.date();
    const objType = DataType.obj(TestObject);

    expect(numberType).toBeInstanceOf(DataType);
    expect(stringType).toBeInstanceOf(DataType);
    expect(boolType).toBeInstanceOf(DataType);
    expect(dateType).toBeInstanceOf(DataType);
    expect(objType).toBeInstanceOf(DataType);

    expect(numberType.validate(123)).toBeUndefined();
    expect(stringType.validate('test')).toBeUndefined();
    expect(boolType.validate(true)).toBeUndefined();
    expect(dateType.validate(new Date())).toBeUndefined();
    expect(objType.validate(new TestObject('a', 1))).toBeUndefined();
  });

  it('should handle optional and nullable modifiers', () => {
    const optionalType = DataType.string().optional();
    const nullableType = DataType.number().null();
    const optionalNullableType = DataType.bool().optional().null();

    expect(optionalType.isOptional).toBe(true);
    expect(nullableType.isNullable).toBe(true);
    expect(optionalNullableType.isOptional).toBe(true);
    expect(optionalNullableType.isNullable).toBe(true);
  });

  it('should validate values correctly', () => {
    const numberType = DataType.number();
    const stringType = DataType.string();
    const boolType = DataType.bool();
    const dateType = DataType.date();
    const objType = DataType.obj(TestObject);

    expect(numberType.validate('abc')).toEqual({ err: 'is not number' });
    expect(stringType.validate(123)).toEqual({ err: 'is not string' });
    expect(boolType.validate('test')).toEqual({ err: 'is not boolean' });
    expect(dateType.validate('test')).toEqual({ err: 'is not Date' });
    expect(objType.validate({})).toEqual({ err: 'is not TestObject' });
  });
});

describe('SchemaValidator', () => {
  it('should validate an item against a schema', () => {
    const schema: Schema = {
      name: DataType.string(),
      age: DataType.number(),
      address: DataType.string().optional().null(),
      birthDay: DataType.date().optional(),
      isActive: DataType.bool().optional(),
    };

    const validItem = { name: 'John', age: 30, address: null };
    const invalidItem = { name: 123, age: 'abc', extra: 'test' };

    const [valid, validErrors] = SchemaValidator.validate(validItem, schema);
    expect(valid).toBe(true);
    expect(validErrors).toEqual([]);

    const [invalid, invalidErrors] = SchemaValidator.validate(invalidItem, schema);
    expect(invalid).toBe(false);
    expect(invalidErrors).toEqual(['name is not string', 'age is not number', 'object includes unknown key "extra"']);

    const missingFieldItem = { name: 'john' };
    const [missingFieldValid, missingFieldErrors] = SchemaValidator.validate(missingFieldItem, schema);
    expect(missingFieldValid).toBe(false);
    expect(missingFieldErrors).toEqual(['age is missing!']);

    const nullFieldItem = { name: 'john', age: null };
    const [nullFieldValid, nullFieldErrors] = SchemaValidator.validate(nullFieldItem, schema);
    expect(nullFieldValid).toBe(false);
    expect(nullFieldErrors).toEqual(['age is not nullable!']);
  });
});

describe('DataClassFactory', () => {
  it('should create an entity with correct types', () => {
    const schema: Schema = {
      name: DataType.string(),
      age: DataType.number(),
      isActive: DataType.bool(),
      createdAt: DataType.date(),
      testObject: DataType.obj(TestObject),
    };

    const TestEntityClass = DataClassFactory(schema);

    const entity = new TestEntityClass({
      name: 'John Doe',
      age: 30,
      isActive: true,
      createdAt: new Date(),
      testObject: new TestObject('test', 1),
    });

    expect(entity.name).toBe('John Doe');
    expect(entity.age).toBe(30);
    expect(entity.isActive).toBe(true);
    expect(entity.createdAt).toBeInstanceOf(Date);
    expect(entity.testObject).toBeInstanceOf(TestObject);
  });

  it('should validate entity fields on creation', () => {
    const schema: Schema = {
      name: DataType.string(),
      age: DataType.number(),
    };

    const TestEntityClass = DataClassFactory(schema);

    expect(() => new TestEntityClass({ name: 123, age: 'abc' })).toThrow(
      'Entity validation failed: name is not string, age is not number',
    );

    expect(() => new TestEntityClass({ name: 'john' })).toThrow('Entity validation failed: age is missing!');
    expect(() => new TestEntityClass({ name: 'john', age: null })).toThrow(
      'Entity validation failed: age is not nullable!',
    );
  });

  it('should return the schema', () => {
    const schema: Schema = {
      name: DataType.string(),
      age: DataType.number(),
    };

    const TestEntityClass = DataClassFactory(schema);
    const entity = new TestEntityClass({ name: 'John Doe', age: 30 });
    expect(entity.getSchema()).toEqual(schema);
  });
});
