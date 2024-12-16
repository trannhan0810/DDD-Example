import { DomainError } from '../base.error';

export class GeoCoordinate {
  readonly long: number;
  readonly lat: number;

  constructor(input: GeoCoordinate) {
    this.long = input.long;
    this.lat = input.lat;
    GeoCoordinate.validate(this);
  }

  static validate(item: GeoCoordinate) {
    GeoCoordinate.validateLongitude(item);
    GeoCoordinate.validateLatitude(item);
  }

  static validateLongitude(item: GeoCoordinate) {
    if (item.long > 180 || item.long < -180) {
      throw new DomainError('Invalid GeoCoordinate: longitude must between -180 and 180');
    }
  }

  static validateLatitude(item: GeoCoordinate) {
    if (item.lat > 90 || item.lat < -90) {
      throw new DomainError('Invalid GeoCoordinate: latitude must between -90 and 90');
    }
  }
}
