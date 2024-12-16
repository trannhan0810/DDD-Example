import type { BaseEntity } from '@domain/base/base.entity';

export interface VenueType extends BaseEntity {
  name: string;
  description: string;
}
