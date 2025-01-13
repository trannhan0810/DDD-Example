import type { BaseEntity } from '@domain/base/base.entity';

export interface Privilege extends BaseEntity {
  name: string;
  code: string;
  level: 'Read' | 'Write';
}
