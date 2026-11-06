import './style.css';
import type { City } from './types.ts';
import citiesData from './data/cities.json';
import { initGlobe, resizeGlobe } from './globe/globe.ts';
import { setMarkers } from './globe/markers.ts';
import { setSunPosition } from './globe/shader.ts';
import { subsolarPoint } from './lib/sun.ts';
import { loadCities, saveCities } from './lib/store.ts';
import { nearestCity } from './lib/nearestCity.ts';
import { renderPanel, tickPanel } from './ui/panel.ts';
import { initSearch } from './ui/search.ts';

const MAX_CITIES = 100;
const allCities = citiesData as City[];
const state: { cities: City[] } = { cities: loadCities() };

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function toast(msg: string): void {
  const el = document.getElementById('toast')!;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2000);
}

function boot(): void {
  const globeEl = document.getElementById('globe')!;
  const panelList = document.getElementById('city-list')!;
  const searchInput = document.getElementById('search') as HTMLInputElement;
  const resultsEl = document.getElementById('results')!;

  let refreshMarkers = () => {};

  let flyTo: (c: City) => void = () => {};

  const addCity = (city: City): boolean => {
    if (state.cities.some((c) => c.id === city.id)) return false;
    if (state.cities.length >= MAX_CITIES) {
      toast(`City limit reached (${MAX_CITIES})`);
      return false;
    }
    state.cities.push(city);
    saveCities(state.cities);
    renderPanel(panelList, state.cities, removeCity);
    tickPanel(state.cities, new Date());
    refreshMarkers();
    return true;
  };

  function removeCity(id: string): void {
    state.cities = state.cities.filter((c) => c.id !== id);
    saveCities(state.cities);
    renderPanel(panelList, state.cities, removeCity);
    tickPanel(state.cities, new Date());
    refreshMarkers();
  }

  initSearch(searchInput, resultsEl, allCities, (c) => {
    if (addCity(c)) flyTo(c);
  });
  renderPanel(panelList, state.cities, removeCity);

  setInterval(() => {
    tickPanel(state.cities, new Date());
  }, 1000);

  if (!hasWebGL()) {
    globeEl.innerHTML =
      '<div id="globe-fallback">WebGL is not available in this browser, so the globe cannot render.</div>';
    return;
  }

  initGlobe(globeEl).then(({ globe: g, material }) => {
    resizeGlobe(g, globeEl);
    window.addEventListener('resize', () => resizeGlobe(g, globeEl));

    refreshMarkers = () => setMarkers(g, state.cities, new Date());
    refreshMarkers();

    flyTo = (c: City) =>
      g.pointOfView({ lat: c.lat, lng: c.lng, altitude: g.pointOfView().altitude }, 1000);

    const updateSun = () => {
      const { lat, lng } = subsolarPoint(new Date());
      setSunPosition(material, lng, lat);
    };
    updateSun();
    setInterval(updateSun, 60_000);

    // Label text carries hh:mm — refresh on minute rollover only.
    let lastMinute = new Date().getMinutes();
    setInterval(() => {
      const m = new Date().getMinutes();
      if (m !== lastMinute) {
        lastMinute = m;
        refreshMarkers();
      }
    }, 1000);

    g.onGlobeClick(({ lat, lng }: { lat: number; lng: number }) => {
      const hit = nearestCity(allCities, lat, lng);
      if (hit) addCity(hit);
    });
  });
}

boot();
