# Design QA — Panel redesign (selected mock: "Option 1")

## Artifacts

- **Source visual truth**: `design-qa/source-mockup.png` (HTML mock at 400×800, 5 pinned cities)
- **Implementation screenshot**: `design-qa/compare-full-1.png` (right half; panel clipped at 400×800 from a 1280×800 capture)
- **Viewport**: 1280×800 desktop, panel region 400×800 (matches mock's natural container size)
- **State**: 5 pinned cities (Tokyo, New York, London, Sydney, Dubai), seeded via localStorage; live clock

## Full-view comparison evidence

`design-qa/compare-full-1.png` — source (left) vs implementation (right), same crop and scale.

## Focused region comparison evidence

`design-qa/compare-zoom-1.png` — header + first two rows at 2×. Fonts, gradient clock, search field, count chip, accent bars, time/bucket type, and ✕ placement match at detail level.

## Findings

- [P2] Search results rendered below the "Pinned cities" section label
  - Location: `index.html` (`#results` vs `.section` order)
  - Evidence: `design-qa/state-search-before-fix.png` — result rows appear under the "PINNED CITIES" label, reading as pinned rows.
  - Impact: misattributes search results to the pinned list while typing.
  - Fix: moved `#results` directly under `.search-wrap`, above `.section`. Post-fix: `design-qa/state-search-after-fix.png`.

No other P0/P1/P2 findings. Fonts/typography, spacing rhythm, color tokens, image/icon fidelity (search glyph is the mock's own inline SVG), and copy all match the source.

## Mock shortcomings (implementation intentionally differs)

- Weekday: mock said "Thursday, 6 November 2026"; Nov 6 2026 is a Friday. Implementation uses live `Intl` — correct.
- Count chip: mock showed "4 / 100" with 5 rows; implementation is data-driven ("5 / 100") — correct.
- Country strings: mock shortened ("United States"); implementation uses real dataset values ("United States of America").
- Clocks: mock pinned to a 14:40 UTC anchor; implementation is live (captured 15:09–15:13 UTC). State mismatch noted per rubric; layout unaffected.
- Mock had no search-results state; the P2 above was found in an additional state capture.

## Comparison history

1. **Iteration 1** (full + zoom): matched typography/spacing/tokens; discovered the P2 results-hierarchy issue in a separate results-state capture (outside the mock's states). Result: blocked on P2.
2. **Iteration 2** (post-fix re-capture): results sit under the search field, "Pinned cities" label and rows below. No new P0/P1/P2. Interaction smoke: search → add (fly-to fires, count 1/100) → remove (count 0/100) — all pass.

## Final result: passed
