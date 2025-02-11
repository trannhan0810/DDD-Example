export type GeoLocation = {
  longitude: number;
  latitude: number;
};

export class Hotel {
  constructor(
    public readonly id: number,
    public name: string,
    public description: string,
    public address: string,
    public geoLocation: GeoLocation,
  ) {}
}
