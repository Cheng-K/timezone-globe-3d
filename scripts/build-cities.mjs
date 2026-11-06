// One-time generator: city-timezones -> src/data/cities.json (runtime never imports the package).
import { cityMapping } from 'city-timezones';
import { writeFileSync, mkdirSync } from 'node:fs';

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const cities = cityMapping
  .filter((c) => c.pop >= 300000)
  .sort((a, b) => b.pop - a.pop)
  .slice(0, 800)
  .map((c) => ({
    id: `${c.iso2}-${slug(c.city)}`,
    name: c.city,
    country: c.country,
    lat: c.lat,
    lng: c.lng,
    tz: c.timezone,
  }));

const seen = new Set();
const deduped = cities.filter((c) => (seen.has(c.id) ? false : seen.add(c.id)));

mkdirSync('src/data', { recursive: true });
writeFileSync('src/data/cities.json', JSON.stringify(deduped));
console.log(`wrote ${deduped.length} cities`);
