// Simple geocoding database (extend as needed)
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Major cities
  "new york": { lat: 40.7128, lng: -74.006 },
  london: { lat: 51.5074, lng: -0.1278 },
  tokyo: { lat: 35.6762, lng: 139.6503 },
  paris: { lat: 48.8566, lng: 2.3522 },
  beijing: { lat: 39.9042, lng: 116.4074 },
  sydney: { lat: -33.8688, lng: 151.2093 },
  mumbai: { lat: 19.076, lng: 72.8777 },
  dubai: { lat: 25.2048, lng: 55.2708 },
  singapore: { lat: 1.3521, lng: 103.8198 },
  "hong kong": { lat: 22.3193, lng: 114.1694 },
  toronto: { lat: 43.6532, lng: -79.3832 },
  "los angeles": { lat: 34.0522, lng: -118.2437 },
  chicago: { lat: 41.8781, lng: -87.6298 },
  "san francisco": { lat: 37.7749, lng: -122.4194 },
  berlin: { lat: 52.52, lng: 13.405 },
  madrid: { lat: 40.4168, lng: -3.7038 },
  rome: { lat: 41.9028, lng: 12.4964 },
  moscow: { lat: 55.7558, lng: 37.6173 },
  seoul: { lat: 37.5665, lng: 126.978 },
  bangkok: { lat: 13.7563, lng: 100.5018 },
  kathmandu: { lat: 27.7172, lng: 85.324 },
  delhi: { lat: 28.7041, lng: 77.1025 },
};

const COUNTRY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  usa: { lat: 37.0902, lng: -95.7129 },
  "united states": { lat: 37.0902, lng: -95.7129 },
  uk: { lat: 55.3781, lng: -3.436 },
  "united kingdom": { lat: 55.3781, lng: -3.436 },
  japan: { lat: 36.2048, lng: 138.2529 },
  china: { lat: 35.8617, lng: 104.1954 },
  india: { lat: 20.5937, lng: 78.9629 },
  australia: { lat: -25.2744, lng: 133.7751 },
  france: { lat: 46.2276, lng: 2.2137 },
  germany: { lat: 51.1657, lng: 10.4515 },
  canada: { lat: 56.1304, lng: -106.3468 },
  brazil: { lat: -14.235, lng: -51.9253 },
  spain: { lat: 40.4637, lng: -3.7492 },
  italy: { lat: 41.8719, lng: 12.5674 },
  russia: { lat: 61.524, lng: 105.3188 },
  "south korea": { lat: 35.9078, lng: 127.7669 },
  thailand: { lat: 15.87, lng: 100.9925 },
  uae: { lat: 23.4241, lng: 53.8478 },
  singapore: { lat: 1.3521, lng: 103.8198 },
  nepal: { lat: 28.3949, lng: 84.124 },
};

export function getCoordinates(
  city?: string,
  country?: string
): { lat: number; lng: number } | null {
  if (city) {
    const cityKey = city.toLowerCase().trim();
    if (CITY_COORDINATES[cityKey]) {
      return CITY_COORDINATES[cityKey];
    }
  }

  if (country) {
    const countryKey = country.toLowerCase().trim();
    if (COUNTRY_COORDINATES[countryKey]) {
      return COUNTRY_COORDINATES[countryKey];
    }
  }

  return null;
}
