import type { City } from '../types.ts';

export function initSearch(
  input: HTMLInputElement,
  resultsEl: HTMLElement,
  allCities: City[],
  onPick: (c: City) => void
): void {
  const show = (matches: City[]) => {
    resultsEl.textContent = '';
    for (const c of matches) {
      const li = document.createElement('li');
      li.textContent = `${c.name}, ${c.country}`;
      li.addEventListener('click', () => {
        input.value = '';
        resultsEl.textContent = '';
        onPick(c);
      });
      resultsEl.append(li);
    }
  };

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      resultsEl.textContent = '';
      return;
    }
    const matches = allCities
      .filter((c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q))
      .slice(0, 8);
    show(matches);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const first = resultsEl.querySelector('li');
    if (first) first.click();
  });
}
