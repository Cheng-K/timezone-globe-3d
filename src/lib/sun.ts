// NOAA low-precision solar position (spreadsheet equations). ~1 deg accuracy.
export function subsolarPoint(now: Date): { lat: number; lng: number } {
  const yearStart = Date.UTC(now.getUTCFullYear(), 0, 1);
  const doy = (Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - yearStart) / 86400000 + 1;
  const hour = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;
  const gamma = ((2 * Math.PI) / 365) * (doy - 1 + (hour - 12) / 24);

  const eqtime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));

  const decl =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes() + now.getUTCSeconds() / 60;
  const lng = ((-(utcMinutes - 720 + eqtime) / 4 + 180) % 360 + 360) % 360 - 180;
  return { lat: (decl * 180) / Math.PI, lng };
}
