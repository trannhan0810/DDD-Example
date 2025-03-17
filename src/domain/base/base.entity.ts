export abstract class BaseEntity<ID extends Id | null = Id> {
  abstract id: ID;

  hasId(): this is BaseEntity<Id> {
    return this.id !== null;
  }
}
