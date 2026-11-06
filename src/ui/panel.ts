import type { Bucket, City } from '../types.ts';
import { getCityLocalTime, timeOfDayBucket } from '../lib/time.ts';

const rowEls = new Map<string, { time: HTMLElement; bucket: HTMLElement; accent: HTMLElement }>();

export function renderPanel(
  container: HTMLElement,
  countEl: HTMLElement,
  cities: City[],
  maxCities: number,
  onRemove: (id: string) => void
): void {
  container.textContent = '';
  rowEls.clear();
  for (const c of cities) {
    const li = document.createElement('li');
    li.dataset.id = c.id;

    const accent = document.createElement('div');
    accent.className = 'accent';

    const who = document.createElement('div');
    who.className = 'who';
    const city = document.createElement('div');
    city.className = 'city';
    city.textContent = c.name;
    const country = document.createElement('div');
    country.className = 'country';
    country.textContent = c.country;
    who.append(city, country);

    const clock = document.createElement('div');
    clock.className = 'clock';
    const time = document.createElement('div');
    time.className = 'time';
    const bucket = document.createElement('div');
    bucket.className = 'bucket';
    clock.append(time, bucket);

    const remove = document.createElement('button');
    remove.className = 'city-remove';
    remove.setAttribute('aria-label', `Remove ${c.name}`);
    remove.textContent = '✕';
    remove.addEventListener('click', () => onRemove(c.id));

    li.append(accent, who, clock, remove);
    container.append(li);
    rowEls.set(c.id, { time, bucket, accent });
  }
  countEl.textContent = `${cities.length} / ${maxCities}`;
}

export function tickPanel(cities: City[], now: Date): void {
  for (const c of cities) {
    const els = rowEls.get(c.id);
    if (!els) continue;
    const { hhmm, hour24 } = getCityLocalTime(c.tz, now);
    const b: Bucket = timeOfDayBucket(hour24);
    els.time.textContent = hhmm;
    els.bucket.textContent = b;
    els.bucket.className = `bucket ${b}`;
    els.accent.className = `accent ${b}`;
  }
}
