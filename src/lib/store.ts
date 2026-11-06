import type { City } from '../types.ts';

const KEY = 'timezone-globe:v1';

export function loadCities(): City[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (parsed?.v !== 1 || !Array.isArray(parsed.cities)) return [];
    return parsed.cities;
  } catch {
    return [];
  }
}

export function saveCities(cities: City[]): void {
  localStorage.setItem(KEY, JSON.stringify({ v: 1, cities }));
}
