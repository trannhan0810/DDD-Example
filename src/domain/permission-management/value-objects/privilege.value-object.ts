import type { ValueObject } from '@domain/base/base.value-object';

export interface Privilege extends ValueObject {
  name: string;
  code: string;
  level: 'Read' | 'Write';
}
