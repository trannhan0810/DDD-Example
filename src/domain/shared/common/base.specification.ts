export interface ISpecification<T> {
  isSastifyBy(item: T): boolean;
}

export abstract class BaseSpecification<T> implements ISpecification<T> {
  abstract isSastifyBy(item: T): boolean;
  and(...otherSpecs: ISpecification<T>[]) {
    return new AndSpecification([this, ...otherSpecs]);
  }
  andNot(otherSpec: ISpecification<T>) {
    return new AndSpecification([this, new NotSpecification(otherSpec)]);
  }
  or(...otherSpecs: ISpecification<T>[]) {
    return new OrSpecification([this, ...otherSpecs]);
  }
  orNot(otherSpec: ISpecification<T>) {
    return new OrSpecification([this, new NotSpecification(otherSpec)]);
  }
}

class AndSpecification<T> extends BaseSpecification<T> {
  constructor(private specs: ISpecification<T>[]) {
    super();
  }
  isSastifyBy(item: T): boolean {
    return this.specs.every(spec => spec.isSastifyBy(item));
  }
}

class OrSpecification<T> extends BaseSpecification<T> {
  constructor(private specs: ISpecification<T>[]) {
    super();
  }
  isSastifyBy(item: T): boolean {
    return this.specs.some(spec => spec.isSastifyBy(item));
  }
}

class NotSpecification<T> extends BaseSpecification<T> {
  constructor(private spec: ISpecification<T>) {
    super();
  }
  isSastifyBy(item: T): boolean {
    return !this.spec.isSastifyBy(item);
  }
}
