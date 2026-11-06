# Timezone Globe 3D

Interactive 3D earth globe that shows the current local time of cities you pin, with a real day/night terminator and morning/afternoon/night coloring on each city marker.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

## Features

- **Search or click to add cities** — search box over a bundled 796-city dataset, or click the globe to add the nearest city within 250 km (ocean clicks do nothing).
- **Live local times** — computed in-browser via `Intl.DateTimeFormat` with IANA timezones (DST handled by the browser's tz database).
- **Day/night terminator** — sun-accurate shading from NOAA low-precision solar position (~1° error), night-lights texture on the dark side.
- **Time-of-day coloring** — markers/labels and panel rows colored by local time: morning (05–12), afternoon (12–18), night (else).
- **Fly-to** — picking a city from search rotates the globe to it (keeps your zoom level).
- **Persistence** — pinned cities saved in `localStorage` (`timezone-globe:v1`), cap of 100 cities.

## Scripts

| Script | What it does |
|--------|--------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run build-cities` | Regenerate `src/data/cities.json` from the `city-timezones` package (dev-only; output is committed) |
| `npm run check-math` | Assertion self-check for the sun-position and time-bucket math (`node:assert`, no test framework) |

## Tech

Vite + vanilla TypeScript + [globe.gl](https://github.com/vasturiano/globe.gl) + three.js. No backend, no runtime dependencies beyond those two.

The day/night blend is a custom `ShaderMaterial` (see `src/globe/shader.ts`) based on globe.gl's `day-night-cycle` example. The sun vector is rotated into the globe mesh's frame on every camera move (`onZoom` → `globeRotation` uniform) — that inverse-rotation step is the non-obvious part.

```
src/
├── main.ts              # wiring: add/remove, clock tick, sun update, fly-to
├── lib/{sun,time,store,nearestCity}.ts
├── globe/{globe,shader,markers}.ts
├── ui/{panel,search}.ts
└── data/cities.json     # generated, committed
```

## Notes

- Earth textures come from the three-globe example assets (MIT repo, no per-image license stated). If that matters for your use, swap in NASA Blue Marble / Black Marble (public domain) in `public/textures/`.
- Timezone data is whatever the browser ships; no tz database is bundled.
