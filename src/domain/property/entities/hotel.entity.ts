import { BaseEntity } from '@domain/shared/common/base.entity';

export type GeoLocation = {
  longitude: number;
  latitude: number;
};

export class Hotel<ID extends Id | null = Id> extends BaseEntity<ID> {
  constructor(
    public readonly id: ID,
    public name: string,
    public description: string,
    public address: string,
    public geoLocation: GeoLocation,
  ) {
    super();
  }
}
