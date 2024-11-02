import type { BaseEntity, EntityId } from '@domain/base/base.entity';
import type { ValueObject } from '@domain/base/base.value-object';

export interface AdditionalServiceType extends ValueObject {
  name: string;
}

export interface AdditionalService extends BaseEntity {
  serviceType: AdditionalServiceType;
  bookingId: EntityId;
  endTime: Date;

  basePrice: number;
}
