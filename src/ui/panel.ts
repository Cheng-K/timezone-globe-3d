import type { Bucket, City } from '../types.ts';
import { BUCKET_COLORS, getCityLocalTime, timeOfDayBucket } from '../lib/time.ts';

const rowEls = new Map<string, { time: HTMLElement; bucket: HTMLElement }>();

export function renderPanel(
  container: HTMLElement,
  cities: City[],
  onRemove: (id: string) => void
): void {
  container.textContent = '';
  rowEls.clear();
  for (const c of cities) {
    const li = document.createElement('li');
    li.dataset.id = c.id;

    const bucket = document.createElement('span');
    bucket.className = 'city-bucket';
    const name = document.createElement('span');
    name.textContent = `${c.name}, ${c.country}`;
    const time = document.createElement('span');
    time.className = 'city-time';
    const remove = document.createElement('button');
    remove.className = 'city-remove';
    remove.setAttribute('aria-label', `Remove ${c.name}`);
    remove.textContent = '×';
    remove.addEventListener('click', () => onRemove(c.id));

    li.append(bucket, name, time, remove);
    container.append(li);
    rowEls.set(c.id, { time, bucket });
  }
}

export function tickPanel(cities: City[], now: Date): void {
  for (const c of cities) {
    const els = rowEls.get(c.id);
    if (!els) continue;
    const { hhmm, hour24 } = getCityLocalTime(c.tz, now);
    const bucket: Bucket = timeOfDayBucket(hour24);
    els.time.textContent = hhmm;
    els.bucket.textContent = bucket;
    els.bucket.style.color = BUCKET_COLORS[bucket];
  }
}
