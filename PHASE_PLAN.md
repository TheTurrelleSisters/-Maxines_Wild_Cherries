# Maxine's Wild Cherries — Phase Plan
## Repo: Maxines_Wild_Cherries
## Source of truth: zip archives delivered in chat. GitHub is behind until uploaded.

---

## Current Version: v1.00 (cache: mwc-v100)

---

## Overview

New $2-denom bingo slot, sibling to `straypups_big_munny_v5_27_PWA` ($1) and
`straypups_big_munny_5d` ($5). Built by cloning the `_5d` repo (v5.90 baseline,
which already includes ALL fixes through v5.90: smooth reel stop, downward spin
direction, reduced blur, the v5.88 forced-jackpot-as-natural redesign, the v5.89
`_forceArmed` reset fix, Custom Bingo Card Generator, etc.) and re-skinning for
the "Maxine's Wild Cherries" theme.

Shares the same backend as all other games: Supabase project
`gdmmoeggkqsvqnqyrubx.supabase.co`, wide-area progressive pot, shared 75-ball
WABC sequence, `BINGO_PATTERNS`/thresholds (identical math to $1/$5 — "same
paytable as the $5 same-scale system"), Supabase SDK `@2.49.0`.

---

## v1.00 — Initial build

### Identity / branding
- `DENOM = 2.00` (was 5.00 in the cloned source).
- `PROG_GAME_ID = 'maxine'`, `PROG_DENOM = 2.00` (set in index.html inline script
  before progressive.js loads).
- `PROG_GAME_TITLES['maxine'] = "Maxine's Wild Cherries"` — added here AND
  cross-referenced into `straypups_big_munny_v5_27_PWA`, `straypups_big_munny_5d`,
  `TSBIGMUNNY`, `progressive_operator`, and `floor_manager`'s `GAMES` map (color
  `#ff3377`) so cross-game Attitude Check notifications and floor-manager
  player-registry/activity views show "Maxine's Wild Cherries" correctly.
- Title/splash: "MAXINE'S WILD CHERRIES" / "$2 • v1.00". `<title>`, apple-mobile-
  web-app-title, header alt text all updated.
- Cache: `mwc-v100` (was `spbm-v590`).
- localStorage: per-game player-state keys renamed `spbm5_bal`/`spbm5_cpl` ->
  `mwc_bal`/`mwc_cpl`. The SHARED/cross-game keys (`spbm_card_ctr`,
  `spbm_used_cards`, `spbm_history`, `spbm_op_pin` — global card-serial counter
  and operator-side localStorage, intentionally shared across all games on a
  device) were left UNCHANGED.
- `js/operator.js` operator-menu header branding updated to "Maxine's Wild
  Cherries v1.00" (escaped apostrophe — watch for this if editing that string
  again, single-quoted JS string).
- `_writeGameHistory` in game.js: default `_gameId`/`_gameTitle` now
  `'maxine'` / "Maxine's Wild Cherries" (was the straypups_1d/5d ternary).
- Help screen ("TOP PATTERNS (BET 1)") dollar amounts updated to reflect $2 DENOM
  scaling (Corporal Stripes $1600, Cross Corners $640, Pyramid/The Kite $320,
  Four Leaf Clover $200, Double Cross/Arrowhead $160, Valentine $100). This was a
  pre-existing inaccuracy in the cloned source (v5d's help screen showed
  unscaled $1-base values) — fixed here for the new repo only; NOT back-ported
  to v5_27_PWA/v5d (out of scope for this build, flag if Sasha wants it fixed
  there too). "SP (Stray Pup)" renamed to "SP (Maxine)" in the Wild Symbols
  section.

### Symbol set (8 slots — same scheme as other games)
`0=SP/Wild  1=Seven  2=3-Bar  3=2-Bar  4=1-Bar  5=Cherry  6=Blank
7=Progressive(unchanged, DJ-pup PNG)`

| id | asset | source |
|----|-------|--------|
| 0 | `assets/symbols/maxine.png` | Sasha-supplied, already transparent-bg, used as-is |
| 1 | `assets/symbols/seven.png` | extracted from sheet 1 (middle tile), color-distance bg removal |
| 2 | `assets/symbols/bar3.png` | extracted from sheet 2 (BAR/BAR/BAR), color-distance bg removal |
| 3 | `assets/symbols/bar2.png` | extracted from sheet 1 (bottom tile, BAR/BAR), color-distance bg removal |
| 4 | `assets/symbols/bar1.png` | extracted from sheet 3 (top tile, single BAR), color-distance bg removal |
| 5 | `assets/symbols/cherry.png` | extracted from sheet 1 (top tile, double-cherry) — this IS the "Cherry" symbol; "2 cherries = 1 cherry symbol" confirmed, CPART/PAY[5] unchanged |
| 6 | none (inline SVG, blank cream rect) | unchanged |
| 7 | `assets/symbols/progressive_jackpot.png` | unchanged, reused as-is |

**Symbol extraction note**: source sheets have busy rainbow-splatter card
backgrounds. Used a color-distance approach (sample background color from crop
corners, fade alpha for pixels within tolerance of that color, slight Gaussian
blur on the alpha edge) rather than simple flood-fill. Results are good for
cherry/seven/bar2/bar1; bar3 (triple bar) and bar1 have minor residual
splatter/glow artifacts at the edges — FIRST PASS, flagged for Sasha's visual
review and possible refinement with cleaner source art (same caveat as the
initial Maxine cutout attempt, before Sasha supplied the clean `maxine_full.png`
used for symbol 0).

### Code changes (js/game.js)
- `SVG` object reduced to just `{6: <blank rect svg>}`.
- New `SYM_FILES` map (ids 1-5 -> PNG paths) and `IMG_SYM` (preloaded Image
  objects, cloned per render).
- `IMG_SCOTT` renamed `IMG_MAXINE` (now points at `assets/symbols/maxine.png`
  instead of `assets/scott_full.png`); `<img id="img-scott">` in index.html
  renamed `id="img-maxine"`.
- `mkSym(id)`: symbols 1-5 now render via `IMG_SYM[id]` (cloned `<img>`,
  `object-fit:contain`, 95%x95%) instead of `innerHTML=SVG[id]`. Symbol 0
  (`IMG_MAXINE`) and 7 (`IMG_PROG_JP`) unchanged in structure, just renamed/
  repointed.
- `.reel-slot` CSS given an explicit `background:#f8f4e8` (cream) — previously
  each inline SVG symbol painted its own cream background (`fill="#f8f4e8"`);
  now that 1-5 are transparent PNGs, the slot itself needs the background so
  symbols sit on the same cream backdrop as before.
- `STRIPS`, `BINGO_PATTERNS`, `PAY`, `VSTOP_TABLE`, `CPART`, `MBAR`, `JP` —
  UNCHANGED. Same math/odds as $1/$5, scaled by the new `DENOM=2.00`.

### Reel STOP_DELAYS / RS_STOP / blur / spin direction
Inherited as-is from v5.90 (v5d baseline) — smooth velocity-matched stop, ghosts-
first downward spin direction, 2px blur. No changes needed; these are
DENOM-independent.

### Service worker
`mwc-v100` cache includes the 6 new symbol assets (`maxine.png`, `seven.png`,
`bar3.png`, `bar2.png`, `bar1.png`, `cherry.png`) added to `FILES` alongside
`progressive_jackpot.png`. `icon-192.png`/`icon-512.png` entries carried over
from the v5d list as-is (these files were not present in the v5d source tree
either — pre-existing, not addressed here).

### Splash / banner
`assets/splash.jpg` and `assets/banner.jpg` replaced with Sasha's "Maxine's Wild
Cherries" title-card artwork (the cherry-vine/rainbow banner with Maxine).

---

## NOT in v1.00 — deferred to later phases

### Phase 3: "Spin to Win" bonus wheel
Full design spec lives in `MAXINES_WILD_CHERRIES_DESIGN.md` (delivered alongside
this repo) — read that file in full before starting Phase 3. Summary:
- 21 wedges (20 BINGO_PATTERNS + 1 dedicated Lazy-T/progressive "JACKPOT" wedge),
  shuffled via round-robin-by-pay-value grouping so duplicate amounts
  (The Kite/Pyramid, Double Cross/Arrowhead, G Flat/Make Cents, Tee/Poodle Dog,
  Stepladder/Hopscotch/Baby Buggy) don't cluster.
- SVG pie-slice wedges with per-wedge `<clipPath>` (prevents label bleed across
  wedges) and labels rotated `midDeg<=180 ? midDeg-90 : midDeg+90` (keeps every
  label within +/-90 degrees of horizontal -- never the full-180 "mirrored/
  backward" rotation that was tried and rejected).
- Wedges show ONLY the dollar amount (big/bold, whole dollars), relabel
  automatically on bet change, no separate bet-selector UI.
- Trigger: random, game-decided, once per spin, ALWAYS the LAST presentation
  step if used (other winning patterns play normal Red Spin first). Main reels
  show a non-winning combo when wheel is chosen.
- Lazy-T can be presented via the wheel's JACKPOT wedge -- underlying
  armAndClaim/Attitude-Check claim mechanics UNCHANGED, wheel is presentation-
  only, landing wedge is predetermined (not actually random).
- Ball caller NEVER freezes during the wheel; bingo card display IS frozen
  until return to reel screen, which then shows the won pattern's cells
  highlighted.
- Congrats screen: randomized video (no immediate repeat) from the existing
  CEL_VIDS-style asset list.
- Reference implementation: `wheel_preview.html` (delivered separately,
  iterated ~6 times -- SVG wedge generation, shuffle algorithm, rotation/clipping,
  Maxine-peeking-out placement, congrats overlay styling all validated there).

### Phase 4: deeper reporting/QA pass
- Confirm `winner_game='maxine'` flows correctly through `progressive_commands`,
  `progressive_hits`, `game_history`, and player_registry rows once live-tested.
- Confirm WABC-Master's shared `wabc-ballpos`/`prog-commands` channels pick up
  this game's sessions correctly (wiring copied verbatim from v5d, not yet
  live-tested).
- Lobby (`turrelle_gold_coins_casino`): new card added to `index.html` (4th
  card, badge `#ff3377`, links to
  `https://theturrellesisters.github.io/Maxines_Wild_Cherries/index.html`,
  4th carousel dot added, marquee text "All 4 Games Connected"). Needs
  `assets/images/maxine_splash.jpg` uploaded (delivered separately) -- and the
  lobby's `service-worker.js` cache list (not in this delivery, Sasha to add
  the new image path) updated per the cache-busting rule.
