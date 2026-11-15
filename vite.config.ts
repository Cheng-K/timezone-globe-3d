import { defineConfig } from 'vite';

// Relative base so the build works on GitHub Pages project sites
// (https://<user>.github.io/timezone-globe-3d/) as well as any root domain.
export default defineConfig({
  base: './',
});
