import type { BaseEntity } from '@domain/base/base.entity';

export type GeoLocation = {
  longitude: number;
  latitude: number;
};

export interface VenueLocation extends BaseEntity {
  name: string;
  description: string;
  address: string;
  geoLocation: GeoLocation;
}
