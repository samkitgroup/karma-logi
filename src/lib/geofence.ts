/** Venue: Shri Gundecha Aaradhna Bhavan area (Goregaon West). */
export const VENUE_LAT = 19.1612169;
export const VENUE_LNG = 72.8454479;
export const VENUE_RADIUS_M = 100;

const EARTH_RADIUS_M = 6_371_000;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function distanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a));
}

export function isWithinVenueRadius(lat: number, lng: number): boolean {
  return (
    distanceMeters(lat, lng, VENUE_LAT, VENUE_LNG) <= VENUE_RADIUS_M
  );
}
