import type { GlobeInstance } from 'globe.gl';
import type { City } from '../types.ts';
import { BUCKET_COLORS, getCityLocalTime, timeOfDayBucket } from '../lib/time.ts';

export function setMarkers(globe: GlobeInstance, cities: City[], now: Date): void {
  globe
    .pointsData(cities)
    .pointLat('lat')
    .pointLng('lng')
    .pointColor((o: object) => {
      const c = o as City;
      return BUCKET_COLORS[timeOfDayBucket(getCityLocalTime(c.tz, now).hour24)];
    })
    .pointRadius(0.35)
    .pointAltitude(0.01)
    .labelsData(cities)
    .labelLat('lat')
    .labelLng('lng')
    .labelText((o: object) => {
      const c = o as City;
      return `${c.name} ${getCityLocalTime(c.tz, now).hhmm}`;
    })
    .labelSize(0.6)
    .labelDotRadius(0)
    .labelResolution(2);
}
