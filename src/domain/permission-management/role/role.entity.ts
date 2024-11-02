import type { BaseEntity } from '@domain/base/base.entity';

export interface Role extends BaseEntity {
  name: string;
  scope: string;
}
