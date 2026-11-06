export type Bucket = 'morning' | 'afternoon' | 'night';

export interface City {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  tz: string;
}
