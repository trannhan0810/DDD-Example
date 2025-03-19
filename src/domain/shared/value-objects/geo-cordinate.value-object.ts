import { DomainError } from '../common/base.error';

export abstract class IGeoCoordinate {
  constructor(
    // ============== //
    public readonly long: number,
    public readonly lat: number,
  ) {}
}

export class GeoCoordinate extends IGeoCoordinate {
  constructor(input: { long: number; lat: number }) {
    super(input.long, input.lat);
    GeoCoordinate.validate(this);
  }

  static validate(item: IGeoCoordinate) {
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
