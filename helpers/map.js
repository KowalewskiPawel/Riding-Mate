export function getRegion(latitude, longitude, distance) {
  const latitudeInMeters = 111.32 * 1000;

  const latitudeDelta = distance / latitudeInMeters;

  const longitudeDelta =
    (distance / latitudeInMeters) * Math.cos(latitude * (Math.PI / 180));

  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
}
