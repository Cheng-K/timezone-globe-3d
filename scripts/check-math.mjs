import assert from 'node:assert/strict';
import { subsolarPoint } from '../src/lib/sun.ts';
import { getCityLocalTime, timeOfDayBucket } from '../src/lib/time.ts';

// --- subsolar point (NOAA low-precision, ~1 deg) ---
{
  const { lat, lng } = subsolarPoint(new Date(Date.UTC(2026, 2, 20, 12, 0, 0)));
  assert.ok(Math.abs(lat) < 1, `equinox decl ${lat}`);
  assert.ok(Math.abs(lng) < 3, `equinox lng ${lng}`);
}
{
  const { lat } = subsolarPoint(new Date(Date.UTC(2026, 5, 21, 12, 0, 0)));
  assert.ok(Math.abs(lat - 23.4) < 1, `june solstice decl ${lat}`);
}
{
  const { lat } = subsolarPoint(new Date(Date.UTC(2026, 11, 21, 12, 0, 0)));
  assert.ok(Math.abs(lat + 23.4) < 1, `dec solstice decl ${lat}`);
}
{
  // subsolar lng at 00:00 UTC is near the antimeridian; must wrap into [-180, 180]
  const { lng } = subsolarPoint(new Date(Date.UTC(2026, 5, 21, 0, 0, 0)));
  assert.ok(lng >= -180 && lng <= 180, `lng range ${lng}`);
  assert.ok(Math.abs(Math.abs(lng) - 180) < 5, `midnight lng ${lng}`);
}

// --- time-of-day buckets ---
assert.equal(timeOfDayBucket(4), 'night');
assert.equal(timeOfDayBucket(5), 'morning');
assert.equal(timeOfDayBucket(11), 'morning');
assert.equal(timeOfDayBucket(12), 'afternoon');
assert.equal(timeOfDayBucket(17), 'afternoon');
assert.equal(timeOfDayBucket(18), 'night');
assert.equal(timeOfDayBucket(23), 'night');
assert.equal(timeOfDayBucket(0), 'night');

// --- local time via Intl (DST correctness comes from the browser tz db) ---
{
  const summer = new Date(Date.UTC(2026, 6, 15, 12, 0, 0)); // July: NY on EDT (UTC-4)
  assert.deepEqual(getCityLocalTime('America/New_York', summer), { hhmm: '08:00', hour24: 8 });
  const winter = new Date(Date.UTC(2026, 0, 15, 12, 0, 0)); // Jan: NY on EST (UTC-5)
  assert.deepEqual(getCityLocalTime('America/New_York', winter), { hhmm: '07:00', hour24: 7 });
  const tokyo = new Date(Date.UTC(2026, 0, 15, 12, 0, 0)); // JST, no DST
  assert.deepEqual(getCityLocalTime('Asia/Tokyo', tokyo), { hhmm: '21:00', hour24: 21 });
}

console.log('check-math: all assertions passed');
