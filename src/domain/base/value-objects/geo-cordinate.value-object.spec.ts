import { GeoCoordinate } from './geo-cordinate.value-object';
import { DomainError } from '../base.error';

test('GeoCoordinate constructor throws error for invalid longitude', () => {
  const invalidInput = { long: 200, lat: 10 };
  expect(() => new GeoCoordinate(invalidInput)).toThrow(DomainError);
});

test('GeoCoordinate constructor throws error for invalid latitude', () => {
  const invalidInput = { long: 50, lat: 100 };
  expect(() => new GeoCoordinate(invalidInput)).toThrow(DomainError);
});

test('GeoCoordinate constructor creates valid object for valid input', () => {
  const validInput = { long: 30, lat: -20 };
  const geoCoordinate = new GeoCoordinate(validInput);
  expect(geoCoordinate.long).toBe(validInput.long);
  expect(geoCoordinate.lat).toBe(validInput.lat);
});

test('GeoCoordinate.validateLongitude throws error for invalid longitude', () => {
  const invalidCoordinate = { long: 220, lat: 10 };
  expect(() => GeoCoordinate.validate(invalidCoordinate)).toThrow(DomainError);
});

test('GeoCoordinate.validateLatitude throws error for invalid latitude', () => {
  const invalidCoordinate = { long: 50, lat: 110 };
  expect(() => GeoCoordinate.validate(invalidCoordinate)).toThrow(DomainError);
});

test('GeoCoordinate.validate does not throw for valid coordinates', () => {
  const validCoordinate = new GeoCoordinate({ long: 70, lat: -50 });
  expect(() => GeoCoordinate.validate(validCoordinate)).not.toThrow();
});
