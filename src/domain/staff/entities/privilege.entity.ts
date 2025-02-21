import { BaseEntity } from '@domain/base/base.entity';

export type PermissionPolicy<Group extends string = string, Action extends string = string> = `${Group}:${Action}`;

export class Privilege<ID extends Id | null = Id> extends BaseEntity<ID> {
  constructor(
    public readonly id: ID,
    public readonly name: string,
    public readonly policy: string,
    public readonly permission: 'Read' | 'Write',
  ) {
    super();
  }
}
