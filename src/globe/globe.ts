import Globe from 'globe.gl';
import type { GlobeInstance } from 'globe.gl';
import { MeshBasicMaterial, TextureLoader } from 'three';
import type { ShaderMaterial } from 'three';
import { makeDayNightMaterial } from './shader.ts';

export interface GlobeHandle {
  globe: GlobeInstance;
  material: ShaderMaterial;
}

export async function initGlobe(el: HTMLElement): Promise<GlobeHandle> {
  const globe = new Globe(el);
  globe.pointOfView({ lat: 20, lng: 0, altitude: 2.5 });

  let material: ShaderMaterial;
  try {
    const loader = new TextureLoader();
    const [dayTexture, nightTexture] = await Promise.all([
      loader.loadAsync('/textures/earth-day.jpg'),
      loader.loadAsync('/textures/earth-night.jpg'),
    ]);
    material = makeDayNightMaterial(dayTexture, nightTexture);
  } catch {
    material = new MeshBasicMaterial({ color: '#1a2a44' }) as unknown as ShaderMaterial;
  }

  globe
    .globeMaterial(material)
    .backgroundImageUrl('/textures/night-sky.png')
    // Sun direction must follow the globe mesh's rotation as the user orbits.
    .onZoom(({ lng, lat }: { lng: number; lat: number; altitude: number }) =>
      material.uniforms.globeRotation.value.set(lng, lat)
    );

  return { globe, material };
}

export function resizeGlobe(globe: GlobeInstance, el: HTMLElement): void {
  globe.width(el.clientWidth).height(el.clientHeight);
}
