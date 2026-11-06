import type { Bucket } from '../types.ts';

export const BUCKET_COLORS: Record<Bucket, string> = {
  morning: '#ffb347',
  afternoon: '#ffd700',
  night: '#5b7fff',
};

const fmtCache = new Map<string, Intl.DateTimeFormat>();

function fmt(tz: string): Intl.DateTimeFormat {
  let f = fmtCache.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    });
    fmtCache.set(tz, f);
  }
  return f;
}

export function getCityLocalTime(tz: string, now: Date): { hhmm: string; hour24: number } {
  const parts = fmt(tz).formatToParts(now);
  const hour = parts.find((p) => p.type === 'hour')?.value ?? '00';
  const minute = parts.find((p) => p.type === 'minute')?.value ?? '00';
  return { hhmm: `${hour}:${minute}`, hour24: parseInt(hour, 10) };
}

export function timeOfDayBucket(hour24: number): Bucket {
  if (hour24 >= 5 && hour24 < 12) return 'morning';
  if (hour24 >= 12 && hour24 < 18) return 'afternoon';
  return 'night';
}
