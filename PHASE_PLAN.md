# Maxine's Wild Cherries — Phase Plan
## Repo: Maxines_Wild_Cherries
## Source of truth: zip archives delivered in chat. GitHub is behind until uploaded.

---

---

---

---

## v1.04 — spinReel direction fix: bottom+column-reverse approach

### Problem
All previous CSS-transition spinReel attempts animated strip.top from 0 to a
large negative value. This moves the strip UP, making symbols appear to scroll
UPWARD — wrong direction.

### Fix
Switched to bottom+column-reverse positioning during spin:
- strip.style.flexDirection = 'column-reverse' (reverses visual symbol order)
- strip.style.bottom = startBottom (large positive, strip starts high)
- Animate bottom: startBottom -> targetBottom (decreasing = strip moves DOWN)
= symbols enter from TOP, scroll DOWNWARD through window ✓

After transitionend, rest strip is rebuilt using the original top positioning
(unchanged), so the at-rest display is unaffected.

This approach matches the working preview HTML that Sasha confirmed looked correct.

## v1.04 — Banner black box fix

### Problem
Banner image (1344x768, aspect ratio 1.75:1) was displaying with black bars
on both sides because `sizeLayout()` in game.js hardcoded `objectFit='contain'`
and incorrectly assumed a 4:1 aspect ratio, overriding the CSS.

### Fix
- `sizeLayout()`: corrected aspect ratio to 1.75 (1344/768), switched to
  `objectFit='cover'` and `objectPosition='center top'` so the banner fills
  the full screen width with no black bars, anchored to top so title and
  Maxine character are always visible.
- `css/styles.css`: `#hdr-img img` updated to match (cover / center top).


## v1.03 — spinReel direction fix (compositor ordering)

### Problem
Same as Stray Pups v5.89 — CSS transition spinReel was spinning upward on
real devices due to compositor layer promotion happening before top=0 was
committed.

### Fix
Same fix as Stray Pups v5.89 applied to MWC game.js.
Also: bold red payline line applied to css/styles.css.


## Current Version: v1.20

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


### v1.05 — EMERGENCY: Service Worker Cache Fix + Missing Icons + Manifest Fix

**ROOT CAUSE:**
1. `icon-192.png`/`icon-512.png` in FILES cache list but ABSENT from repo
   entirely — no icons folder existed at all. Atomic `cache.addAll()` failure =
   game never installed, stuck at splash.
2. `manifest.json` still said "StrayPups Big Munny $5" — never updated for Maxine.
3. All script `?v=` query strings were mismatched (some at v5.90, one at v5.94,
   one at v1.00).

**Fixes applied:**
- Copied `assets/icons/` folder from $5 game (all icon sizes present)
- `service-worker.js`: corrected icon paths to `assets/icons/icon-192x192.png`,
  bumped CACHE to `mwc-v105`, removed mismatched FILES entries
- `manifest.json`: updated name/short_name/description to Maxine's Wild Cherries,
  corrected icon paths to `assets/icons/`
- `index.html`: all version strings unified to v1.05

- Cache bust: mwc-v105


### v1.06 — CRITICAL: Missing Closing Brace in runRS() (Syntax Error)

Same root cause as $1/$5 bingo games — `runRS()` missing closing `}`.

- Cache bust: mwc-v106

---

### v1.14 — Comprehensive Fix Pass + Permanent Design Rules

Built from original uploaded files. All previous patch sessions discarded.

**All 14 fixes applied — see GAME_DESIGN_RULES section below for full details.**

- Cache bust: 'mwc-v114'


---

### v1.20 — CRITICAL: Red Spin Permanent Lockup Fixed (runRS misplaced brace — ported from PWA v5.112)

**ROOT CAUSE:** Inside `runRS()` (js/game.js), `playNext`'s closing brace `}` was
placed BEFORE `setTimeout(playNext,200)`, trapping the kickoff call inside
`playNext`'s own body. Every invocation of `playNext()` re-scheduled itself
200ms later unconditionally, racing `seqIdx` past `rsPatterns.length` on any
spin that won 2+ bingo patterns simultaneously. `pat` became `undefined`, the
next `pat.*` access threw inside an uncaught async callback, and `onDone()`
never fired — `S.spinning` / `setCtrl(false)` stayed stuck forever.
Single-pattern wins never call `runRS` at all, so this only surfaced on
multi-pattern Red Spin wins (the reported lockup).

**FIX:** Moved `playNext`'s closing `}` to immediately follow `_onReelDone`'s
closing brace, then placed `setTimeout(playNext,200)` after it at `runRS`'s
own scope — so it fires exactly once per `runRS()` call, as originally intended.
Identical fix to PWA v5.112 (ported verbatim). Added explanatory comment.

**NOTE:** The v5.96 spinReel-call fix (spinReel calls present, _onReelDone
wired correctly) was already in place in this build — only the brace
placement needed correction.

**Verified:** `node --check` clean on js/game.js.

- Cache bust: mwc-v120

---

# PERMANENT GAME DESIGN RULES

**ALL future engineers MUST read before making ANY changes.**

# ============================================================
# STRAYPUPS BIG MUNNY — PERMANENT GAME DESIGN RULES
# ============================================================
# 
# ⚠️  MANDATORY: Every engineer and developer MUST read this
#     document before making ANY changes to the game code.
#     These rules are LAW. Breaking them breaks the game.
# ============================================================

## 1. GAME TYPE
Class II Bingo game. The slot reels are ENTERTAINMENT ONLY.
All wins are determined by bingo outcomes, not reel outcomes.
The bingo evaluation runs FIRST. The reel result is then FORCED
to match the winning bingo pattern's assigned symbol combination.
On a no-win spin, the reels show a non-win combination that does
NOT visually look like a win.

---

## 2. SYMBOL TABLE

| ID | Symbol            | Type    | File/Render           |
|----|-------------------|---------|-----------------------|
| 0  | Stray Pup (SP)    | WILD    | scott_full.png        |
| 1  | Seven (7)         | Normal  | SVG inline            |
| 2  | Triple Bar (3B)   | Normal  | SVG inline            |
| 3  | Double Bar (2B)   | Normal  | SVG inline            |
| 4  | Single Bar (1B)   | Normal  | SVG inline            |
| 5  | Cherry (CHR)      | Normal  | SVG inline            |
| 6  | Blank             | Non-win | Empty slot (dark tape)|
| 7  | Progressive JP    | WILD    | progressive_jackpot.png|

### Wild Symbol Rules (SP and Progressive JP):
- **1 Wild**: Doubles the winning combination pay
- **2 Wilds**: Pays 4× the winning combination
- **3 Wilds (SP+SP+SP)**: Jackpot — Corporal Stripes pattern
- SP and Progressive JP are INTERCHANGEABLE wilds
- Any mix of SP and JP counts (e.g. SP+JP+Seven qualifies as 2-wild Seven)
- 3× Progressive JP exclusively = Lazy-T Progressive Jackpot
- Wilds NEVER appear on the payline during a no-win spin

### Blank Symbol Rules:
- Blank appears ONLY in Cherry-based wins and non-win stops
- Blank NEVER appears with Bar or Seven winning combinations
- Example valid combos: Cherry+Blank+Blank (Open Diamond), Blank+Cherry+Bar (Open Diamond)
- Example invalid: Seven+Blank+Seven (impossible — Blanks never with Sevens)

---

## 3. CHERRY WIN HIERARCHY (ascending pay)

| Pattern       | Qualifying Payline Combo              | Wilds |
|---------------|---------------------------------------|-------|
| Open Diamond  | 1 Cherry + any non-wild (incl. Blank) | None  |
| EII           | 2 Cherries + any non-wild (incl. Blank)| None |
| Baby Buggy    | 3 Cherries                            | None  |
| Hopscotch     | 1 Wild + 1 Cherry + any              | 1     |
| Make Cents    | 1 Wild + 2 Cherries                  | 1     |
| Poodle Dog    | 2 Wilds + 1 Cherry                   | 2     |

---

## 4. BAR/SEVEN WIN HIERARCHY

Bars and Sevens NEVER have Blank positions. All 3 reels must show
a non-blank symbol for any Bar or Seven combination to pay.

### Seven Patterns (descending wild count):
| Pattern          | Combo                    | Pay Tier |
|------------------|--------------------------|----------|
| Corporal Stripes | 3× Wild (any combo)       | JACKPOT  |
| Cross Corners    | 2× Wild + Seven          | High     |
| Pyramid          | 1× Wild + 2× Seven       | High     |
| Double Cross     | 3× Seven                 | High     |

### Triple Bar Patterns:
| Pattern   | Combo                    | Pay Tier |
|-----------|--------------------------|----------|
| The Kite  | 2× Wild + Triple Bar     | High     |
| Arrowhead | 1× Wild + 2× Triple Bar  | High     |
| G Flat    | 3× Triple Bar            | Mid      |

### Double Bar Patterns:
| Pattern          | Combo                    | Pay Tier |
|------------------|--------------------------|----------|
| Four Leaf Clover | 2× Wild + Double Bar     | High     |
| Valentine        | 1× Wild + 2× Double Bar  | Mid      |
| Christmas Tree   | 3× Double Bar            | Mid      |

### Single Bar Patterns:
| Pattern         | Combo                   | Pay Tier |
|-----------------|-------------------------|----------|
| Private Stripes | 2× Wild + Single Bar    | Mid      |
|                 | OR 3× Single Bar        | Mid      |
| Tee             | 1× Wild + 2× Single Bar | Mid      |

### Mixed Bar Patterns:
| Pattern      | Combo                              | Pay Tier |
|--------------|------------------------------------|----------|
| Stepladder   | 1× Wild + Triple Bar + Double Bar  | Mid      |
| Small Diamond| Triple Bar + Double Bar + Single Bar| Low     |

---

## 5. RED SPIN RULES (PERMANENT — NEVER CHANGE)

**Red Spin triggers ONLY when the player wins 2 or more bingo patterns on the same spin.**

Flow:
1. Main reels spin and land on the LOWEST paying pattern's symbol combo
2. Screen turns RED
3. Red Spin plays the NEXT pattern (ascending by pay):
   - Reels spin and land on that pattern's symbol combo
   - As the 3rd reel lands, the bingo card immediately highlights that pattern's cells
   - Win amount added to Bonus Total
4. Continues ascending through all remaining patterns
5. Red Spin ends → ALL won patterns cycle in a loop showing each pattern's
   cell highlight in order they were won
6. Loop continues until player presses Spin

**Single pattern win** = no Red Spin. Main reels show combo, win displays, game unlocks.
**Progressive (Lazy-T) win** = main reels show 3× Progressive JP, straight to jackpot celebration.
**Cover All 40** = penny toast + DB signal. No reels. No Red Spin.
**Cover All 75** = natural ball call end. Nothing happens. DB already knows.

---

## 6. BINGO PATTERN DEFINITIONS

Cell index map (5×5 grid, row-major, 0=top-left):
```
  B   I   N   G   O
  0   1   2   3   4   ← row 1
  5   6   7   8   9   ← row 2
 10  11  12  13  14   ← row 3  (12 = FREE SPACE, always daubed)
 15  16  17  18  19   ← row 4
 20  21  22  23  24   ← row 5
```

| Pattern           | Balls | Pay (1/2/3)      | Reel Key | Cells                                     |
|-------------------|-------|------------------|----------|-------------------------------------------|
| Corporal Stripes  | 27    | 800/1600/2500    | jp       | 2,6,7,8,10,11,12,13,14,15,19             |
| Cross Corners     | 29    | 320/640/960      | 7w4      | 0,4,7,11,12,13,17,20,24                  |
| Pyramid           | 29    | 160/320/480      | 7w2      | 12,16,17,18,20,21,22,23,24               |
| The Kite          | 35    | 160/320/480      | 3bw4     | 0,1,2,5,6,7,10,11,12,18,24               |
| Double Cross      | 28    | 80/160/240       | 7        | 2,6,7,8,12,16,17,18,22                   |
| Arrowhead         | 30    | 80/160/240       | 3bw2     | 2,6,7,8,10,12,14,17,22                   |
| G Flat            | 36    | 40/80/120        | 3b       | 2,3,4,7,12,15,16,17,20,21,22             |
| Make Cents        | 29    | 40/80/120        | spchch   | 2,6,7,8,11,12,16,17,18,22                |
| Four Leaf Clover  | 34    | 100/200/300      | 2bw4     | 1,5,6,7,11,12,13,17,18,19,23             |
| Valentine         | 37    | 50/100/150       | 2bw2     | 4,6,8,10,12,14,16,18,20,22               |
| Tee               | 38    | 20/40/60         | 1bw2     | 0,1,2,3,4,7,12,17,22                     |
| Poodle Dog        | 35    | 20/40/60         | spspch   | 0,1,6,11,12,13,14,16,18,21,23            |
| Christmas Tree    | 38    | 25/50/75         | 2b       | 2,6,7,8,10,11,12,13,14,17,22             |
| Private Stripes   | 30    | 12/24/36         | 1b       | 2,6,8,10,12,14                           |
| Stepladder        | 36    | 10/20/30         | spmb     | 4,7,8,12,15,16,20                        |
| Hopscotch         | 38    | 10/20/30         | spch     | 1,3,7,11,12,13,17,21,23                  |
| Baby Buggy        | 35    | 10/20/30         | ch3      | 3,4,8,10,11,12,13,15,16,17,18,21,23      |
| Small Diamond     | 38    | 5/10/15          | mb       | 7,11,12,13,17                            |
| EII               | 38    | 4/8/12           | ch2      | 0,5,10,15,20,21,22,23,24                 |
| Open Diamond      | 38    | 2/4/6            | ch1      | 2,10,12,14,22                            |
| Lazy-T            | 25    | Progressive Pot  | coverall | 4,9,10,11,12,13,14,19,24                 |
| Cover All 40      | 40    | $0.01 (penny)    | null     | All 25 cells                             |
| Cover All 75      | 75    | None             | null     | All 25 cells                             |

**Notes:**
- Cell 12 (free space) is always daubed. It's included in pattern cells for
  visual correctness but is SKIPPED in win evaluation (never blocks a win).
- Lazy-T = O column (4,9,14,19,24) + middle row (10,11,12,13,14) = 9 unique cells
- Cover All 40: penny + DB sequence reset signal. NO reel association.
- Cover All 75: natural end. Nothing happens. Ball caller runs to 75.

---

## 7. REEL KEY DEFINITIONS (REEL_SYMS)

The reel key is the QUALIFYING minimum combination. The actual reel
strip shuffles equivalent combinations each spin for variety.

| Key      | Symbols [R1,R2,R3] | Description              |
|----------|--------------------|--------------------------|
| jp       | [0,0,0]            | SP + SP + SP (Jackpot)   |
| 7w4      | [0,0,1]            | SP + SP + Seven          |
| 7w2      | [0,1,1]            | SP + Seven + Seven       |
| 7        | [1,1,1]            | Seven + Seven + Seven    |
| 3bw4     | [0,0,2]            | SP + SP + Triple Bar     |
| 3bw2     | [0,2,2]            | SP + Triple + Triple     |
| 3b       | [2,2,2]            | Triple + Triple + Triple |
| 2bw4     | [0,0,3]            | SP + SP + Double Bar     |
| 2bw2     | [0,3,3]            | SP + Double + Double     |
| 2b       | [3,3,3]            | Double + Double + Double |
| 1bw4     | [0,0,4]            | SP + SP + Single Bar     |
| 1bw2     | [0,4,4]            | SP + Single + Single     |
| 1b       | [4,4,4]            | Single + Single + Single |
| mb       | [2,3,4]            | Triple + Double + Single |
| spmb     | [0,2,3]            | SP + Triple + Double     |
| spch     | [0,5,4]            | SP + Cherry + Single     |
| ch3      | [5,5,5]            | Cherry + Cherry + Cherry |
| ch2      | [5,5,4]            | Cherry + Cherry + Single |
| ch1      | [5,4,3]            | Cherry + Single + Double |
| spspch   | [0,0,5]            | SP + SP + Cherry         |
| spchch   | [0,5,5]            | SP + Cherry + Cherry     |
| coverall | [7,7,7]            | JP + JP + JP (Lazy-T)    |
| none     | [4,2,3]            | No-win (1B+3B+2B)        |

---

## 8. BALL CALLER RULES

- **WABC (Wide Area Ball Caller)**: Primary. Shared across all games.
  All players see the same 75-ball sequence simultaneously.
- **Local ball caller**: Fallback only. Activates if WABC is unavailable.
  Game seamlessly reconnects to WABC when restored.
- **ballPos 0-39**: Pre-called zone. Evaluated for bingo patterns on spin.
- **ballPos 40-75**: Entertainment zone. Balls called every 3.2-3.5s.
  No bingo evaluation — display only.
- **Cover All 40**: All 25 cells covered within balls 1-40 → penny + new sequence.
- **Cover All 75**: All 25 cells covered in balls 41-75 → do nothing (natural end).
- **Ball 75**: Sequence exhausted naturally. WABC Master generates next sequence.

### Ghost Card Prevention:
- During idle/demo state, NEVER render actual ball-matched cells on the bingo card.
- The showcase pattern highlight owns the card display during idle/demo.
- `GS.state !== 'idle' && GS.state !== 'demo'` guard MUST wrap all
  `renderBingoCard(BG.card, BG.matchedCells, null)` calls in:
  - `_activeCallNext()`
  - `onBallCallUpdate()` handler
  - Any other handler that fires during idle

---

## 9. PROGRESSIVE JACKPOT RULES

- Pattern: **Lazy-T** (O column + middle row, 9 cells, ≤24 called balls)
- Class II compliant: bingo-determined, not RNG-determined
- Reel: 3× Progressive JP symbol (progressive_jackpot.png)
- When Lazy-T wins: main reels show coverall (7-7-7), straight to jackpot
- Sub-patterns that co-win are paid silently — no separate reel stops
- Must-hit-by ceiling: server-side threshold in `progressive` table
- `progressive_commands` force_jackpot mechanism: REMOVED (v5.99+)
- `_armRandomTrigger`: REMOVED (v5.99+)
- `_checkArmedCommand`: REMOVED (v5.99+)
- `_subscribeCommands`: REMOVED (v5.99+)

---

## 10. CODE RULES (ENFORCED)

1. **Cache bust every build**: Update title, splash-ver, ALL ?v= query strings,
   and service-worker.js CACHE string. All must match. Verify with grep.
2. **node --check before packaging**: Run syntax check on ALL modified JS files.
3. **Folder names in zips**: v1/ for $1 game, v5d/ for $5 game, maxine/ for Maxine.
4. **Multi-repo awareness**: Check if fixes apply across all 3 games.
5. **PHASE_PLAN.md**: Read and update before AND after every build.
6. **Clarify before building**: Explain changes, wait for explicit confirmation.
7. **No custom_card**: Feature permanently removed. Never re-add.
8. **No force_jackpot commands**: Operator force jackpot permanently removed.
9. **No _armRandomTrigger**: Client-side random trigger permanently removed.
10. **Red Spin design is FINAL**: Never change the Red Spin flow defined in Section 5.

---

## 11. TOOLS (in /assets/ folder of each game repo)

- `bingo_pattern_mapper.html` (v5): Original pattern mapper
- `bingo_pattern_mapper_v6.html` (v6): Updated with Progressive JP symbol,
  visual reel icons, Cherry/Bar/Seven hierarchy. Use v6 for all future mapping.
- `bingo_pattern_mapper.html` in root: Same as assets version.

**These tools are REFERENCE DOCUMENTS. Any pattern or reel assignment
changes MUST be validated in the mapper tool first, output shared for
approval, then applied to config.js. Never change reel assignments
or pattern cells without going through this process.**


---

## ✅ CONFIRMED STABLE BASELINE — v1.20 (pre-v6.0)

Last confirmed working version before v6.0 sync. $2 denomination. PROG_GAME_ID='maxine'.

**Note:** splash-ver was stale at v1.06 despite CACHE/title at v1.20 — corrected in v6.0.

---

## v6.0 — Sync with $1 Game + All Fixes + Symbol Size Fix

**Synced from straypups_big_munny_v5_27_PWA v6.0**

### Changes applied:

**Pattern Showcase (double-run fix):**
- `_showcaseRunning` boolean guard added — prevents timer stacking from sizeLayout calls
- `sizeLayout()` now calls `startPatternShowcase()` not `_showNextPattern()` directly
- `_showNextPattern()` dual guard: `!_showcaseRunning || GS.state!=='idle'`
- Dwell: 2500ms → 5000ms fixed. 250ms blank frame between patterns
- Cell CSS transition: `.15s` → `.25s`

**Red Spin pattern reveal:**
- Name and card highlight cleared before spin starts
- Revealed on 3rd reel stop — player sees result at moment of landing, not before

**Cover All penny (wrong player fix):**
- `_handleCoverAll()` `hasPenny` param removed
- `_broadcastCoverAll()` added — local penny + toast only, no `broadcast_messages` insert
- `BG.awaitingNewSeq` and `BG._coverAll75Fired` set correctly

**Red Spin card lock:**
- `!S.spinning` gate added to all external `renderBingoCard` callers:
  `_activeCallNext`, `onBallCallUpdate`, `onNewCall`, `onForceLocal`, `onRestoreWide`

**Startup message spam fix:**
- `_checkUnreadMessages()`: 30-minute age cutoff + 3-message cap

**wabc.js:**
- `applyLocalNewCall()` added for Cover All triggering player ball-pos sync

**broadcast-init.js:**
- Replaced with v1.4 — dead code removed

**Service worker:**
- `scott_full.png` added to FILES cache
- `manifest.json` added to FILES cache
- CACHE: `mwc-v600`

**splash-ver mismatch fixed:**
- Was showing `$2 • v1.06` while title/CACHE said v1.20 — all now `v6.0`

**NEW — Symbol size normalization:**
- Root cause: each PNG has a very different native aspect ratio
  (bar1=270×130 flat, progressive_jackpot=320×379 portrait, etc.)
  `object-fit:contain` in a square slot made flat symbols appear tiny
  vs tall symbols appearing dominant
- Fix: base size reduced from `width:95%;height:95%` to `width:80%;height:80%`
  for all symbols (consistent visual footprint)
- Per-symbol CSS overrides via `data-sym` attribute on `.reel-slot`:
  - `[data-sym="1b"]` (bar1 flat): 93%
  - `[data-sym="2b"]` (bar2): 88%
  - `[data-sym="3b"]` (bar3): 85%
  - `[data-sym="chr"]` (cherry): 83%
  - `[data-sym="jp"]` (progressive JP, portrait-tall): 70%
  - `maxine`, `7`, `blank`: base 80% (near-square, no override needed)
- `buildSlot()` now sets `data-sym` attribute on every `.reel-slot`
- Inline `width:95%;height:95%` removed from all `img.style.cssText` calls
  — CSS rules now fully own sizing

**Architecture note (deferred):**
Maxine still uses the local client-driven ball ticker (`WABC.onChange` not wired,
`WABC.setPosProvider` still active). The $1 game migrated to the server-driven
`wabc-ball-ticker` Edge Function in v5.121. Maxine should be migrated in a
future dedicated build once the server-driven architecture is confirmed stable
across all three games.

- Cache bust: mwc-v600


---

## v6.00 — Full Architecture Sync with $1 Game

**All gaps between Maxine and straypups_big_munny_v5_27_PWA v6.0 closed.**

### Changes applied:

**Server-driven ball caller (wabc-ball-ticker) — MIGRATED:**
- `startActiveCaller()`/`stopActiveCaller()` converted from timer-based to boolean flag only
- `_activeCallNext()` removed — server drives ball positions via `WABC.onChange`
- `_onServerBallPos()` added — handles server `pos` broadcasts (balls 41-75), daubing, rendering, Cover All 75 detection
- `WABC.onChange(function(newPos){ _onServerBallPos(newPos); })` wired in WABC init block
- `WABC.setPosProvider()` / `WABC.onSyncResponse()` legacy sync handlers removed
- `BG.entTimer` init changed from `null` → `false`
- `BG.callSeq` init changed from `genBallCall()` → `[]` (populated by WABC on connect)
- `BG.ballPos` init changed from `0` → `40` (server starts entertainment at 40)

**Demo mode eliminated:**
- `enterDemo()`, `exitDemo()`, `checkDemoTrigger()`, `GS.demoTimer` removed
- `GS.state` init simplified: no `demoTimer` property, only `{state:'idle',hasSpun:false}`
- All `GS.state!=='demo'` guards replaced with `GS.state==='active'`

**Force jackpot removed:**
- `_forceJP` variable and `Progressive.contribute()` return-value path removed from `doSpin()`
- `Progressive.claimForce()` block removed
- `generateCoverAllSpin()` function removed (was only called from force jackpot path)
- `_progPat._forceAmt` branch in `_continueSpinAfterClaim` removed
- `doSpin()` now calls `_continueSpinAfterClaim()` directly (no async fork)
- `contribute()` now called via `if(Progressive.contribute) Progressive.contribute(S.cpl*DENOM)` — no return value used

**doSpin improvements:**
- `BG.awaitingNewSeq` guard added — blocks spin while new sequence loading
- WABC local fallback (`genBallCall()`) removed from WABC init block

**_requestNewWABCSequence upgraded:**
- `WABC.applyLocalNewCall()` called after broadcast — syncs internal `_issuedAt` for triggering player, prevents balls 41-75 freeze
- Now also resets `BG.callSeq`, `BG.ballPos`, `BG.awaitingNewSeq`, `BG._coverAll75Fired` locally

**Hot Dog pattern added to paytable.js:**
- `'spjpch':[0,7,4]` added to REEL_SYMS
- `{name:'Hot Dog', balls:39, pay:[40,80,120], reel:'spjpch', cells:[6,7,8,10,11,12,13,14,16,17,18]}` added before Lazy-T

**All previously applied v6.0 fixes retained:**
- Symbol size normalization (data-sym CSS selectors)
- Pattern showcase double-run fix (_showcaseRunning guard)
- Red Spin reveal on 3rd reel stop
- Cover All penny local-only (_broadcastCoverAll, no broadcast_messages insert)
- _checkUnreadMessages 30min cutoff + 3msg cap
- Red Spin card lock (!S.spinning gate on all external renderBingoCard calls)
- broadcast-init.js v1.4
- applyLocalNewCall in wabc.js
- scott_full.png + manifest.json in SW cache

- Cache bust: mwc-v600


---

## v1.01 — VERIFIED RE-SYNC with $1/$5 games (post-audit)

**Context:** A side-by-side code audit (not just a PHASE_PLAN read) found that
the "v6.00 — Full Architecture Sync" entry above describes changes that were
NOT actually present in the delivered zip's `js/game.js` and `wabc.js`. The
log entry appears to document an intended change-set that did not make it
into the packaged build — `_onServerBallPos()` was absent, `_forceJP` /
`Progressive.contribute()` / `generateCoverAllSpin()` were all still present
and live, and `WABC.applyLocalNewCall` existed in `wabc.js` but was never
added to the module's returned public API (so `game.js` could never have
called it even if it had tried). This entry documents what was verified
present in the code and fixed in THIS pass.

**Verified bugs found in the delivered v6.0 zip (same root causes as the
$5 game's audit):**

1. No `_onServerBallPos()` — entertainment phase (balls 41-75) was still
   running on the old client-side `_activeCallNext` timer instead of the
   server-driven `WABC.onChange` model.
2. `WABC.applyLocalNewCall` defined but not exported from `wabc.js`, and
   never called from `game.js`.
3. Legacy Force Jackpot path (`_forceJP`, `Progressive.contribute()` return
   value, `generateCoverAllSpin()`, `Progressive.claimForce()`) still fully
   wired and reachable on every spin.
4. `paytable.js`'s player-facing `PAYS_SCREEN` was missing the "Hot Dog"
   entry (BINGO_PATTERNS itself already had it correctly).
5. A separate local `var DENOM` redeclared the same value already available
   globally as `PROG_DENOM` (set in index.html) — redundant dual source of
   truth for the same number.
6. **Critical payout bug found in this pass, not previously documented:**
   Red Spin's `payAmt=pat.pay[cpl-1]` was missing its denom multiplier.
   Maxine's pre-sync code had this correct (`pat.pay[cpl-1]*DENOM`); the
   $1-game's equivalent line has the same gap but it's invisible there
   because PROG_DENOM=1. Restored as `pat.pay[cpl-1]*PROG_DENOM`.
7. `index.html` shipped the Eruda debug console, was missing `?v=` on the
   manifest link, had stale "FORCE JACKPOT" win-overlay text, and was
   missing `webkit-playsinline` on the win video — same hygiene issues
   found in the $5 game.
8. `service-worker.js` cache list was missing `js/paytable.js`; cache name
   needed version-bumping.
9. Orphaned StrayPups-character art (`scott.png`, `scott_full.png`,
   `sisters.png`, `sisters_celebrate.png`, `sasha_solo_celebrate.png`) sat
   unused in `assets/` — confirmed via grep that nothing in the codebase
   references them. Removed. (`assets/videos/*.mp4` dance clips ARE used —
   shared win-celebration footage, same files the $1/$5 games use — kept.)

**Fix approach — same as $5 game, adapted for Maxine's real symbol/denom
differences:**

`js/game.js` was rebuilt from the $1 source of truth (architecture/logic),
with every genuine Maxine-specific adaptation re-applied on top and
verified line-by-line against the original: PNG-based `mkSym()`/`buildSlot()`
with `SYM_DATA_ATTR`/`IMG_SYM`/`IMG_MAXINE` (replacing $1's SVG-drawn
bar/seven/cherry symbols), 1.75:1 banner aspect ratio with cover/top
positioning (vs $1's 4:1 contain/center — verified against actual image
dimensions), `mwc_bal`/`mwc_cpl` localStorage keys, and `PROG_DENOM`-based
bet arithmetic throughout `doSpin()` (debit, comparison, Progressive.contribute,
balBefore, all `opLog` bet fields, betval display, both WABC-unavailable
refund paths) replacing the old standalone `DENOM` variable.

`wabc.js`, `broadcast-init.js`, `js/progressive.js`, `js/operator.js` (branding
line only), `css/styles.css` (Maxine's per-symbol aspect-ratio CSS and 1.75:1
header sizing preserved, blur/background already-redundant rule dropped)
synced from the $1 source of truth the same way as the $5 game.

`js/config.js` — KEPT Maxine's own `VSTOP_TABLE`/`STRIPS` (her own reel math —
verified byte-identical before/after this pass, never touched); only cleaned
up stale header comments referencing sections that no longer live in this
file (BINGO_PATTERNS/SYMBOL_DEFS live in paytable.js, matching the $1/$5 note)
and removed a dead trailing "BINGO PATTERNS" doc-comment block with no
actual array after it.

`js/paytable.js` — added the missing "Hot Dog" line to `PAYS_SCREEN`'s
MID PAYS section. BINGO_PATTERNS/REEL_SYMS were already complete and correct.

`index.html` — rebuilt from $1's structure (correct script load order,
no Eruda, `?v=` on manifest, generic win text, `webkit-playsinline`) with
Maxine's branding (`img-maxine`, "MAXINE'S WILD CHERRIES" splash, $2 denom
display, $100/$500/$1,000/$5,000 bet presets, `PROG_GAME_ID='maxine'`,
`PROG_DENOM=2.00`) reapplied.

`service-worker.js` — rebuilt from $1's structure with Maxine's actual
asset list (5 PNG symbol files + progressive_jackpot.png, no scott_full.png).

**NOT changed:** `VSTOP_TABLE`/`STRIPS` reel math, pattern showcase's
un-denom-multiplied `pat.pay[]` display text (matches $1/$5's existing
behavior — a pre-existing display quirk shared by all three games, out of
scope for an architecture-parity pass).

**Version:** `1.01` — CACHE bumped to `mwc-v101`, all `?v=` strings consistent.


---

## v1.05 — Messaging system migration + broadcast_messages removal + none stop fix

### Changes
- `js/paytable.js`: `REEL_SYMS['coverall']` renamed to `'lazyt'`; Lazy-T pattern `reel:'coverall'` → `reel:'lazyt'`; comment corrected to "25 balls drawn (24 called + free space)"; `REEL_SYMS['none']` fixed from `[4,2,3]` to `[6,4,6]` (blank guards — port from $1 game v6.1 fix)
- `js/game.js`: `REEL_SYMS['coverall']` → `REEL_SYMS['lazyt']`; Red Spin comment updated
- `js/progressive.js`: Removed `broadcast_messages` subscription system. Added operator inbox system: `_subscribeOpMessages()`, `_loadOpMessages()`, `onOpMessage()` reading from `public.messages`
- `index.html`: Added `op-msg-subject` element; `showNextMessage()` renders subject + icon + body; `Progressive.onMessage` wire replaced by `Progressive.onOpMessage`; all `?v=` → `1.05`

### Version bump
| File | Change |
|------|--------|
| `service-worker.js` | `CACHE = 'mwc-v105'` |
| `index.html` | title, splash-ver, all `?v=` → `1.05` |

---

## 1.06 — Trigger 2: Server-side progressive threshold + guaranteed Lazy-T card

### Changes
- `js/progressive.js`: Added `isForceArmed()` accessor exposing internal `_forceArmed && !!_forceCommandId && !_forceClaimed` state to game.js
- `js/game.js`: Added `_genGuaranteedLazyTCard(callSeq)` function — generates a valid bingo card guaranteed to hit Lazy-T within first 24 called balls by assigning Lazy-T cell values from balls already in the server WABC sequence. Falls back to normal `genBingoCard()` if insufficient matching balls. Added Trigger 2 check at top of `doBingoSpin()` after `genBingoCard()` — if `Progressive.isForceArmed()` true, replaces card with guaranteed card. Card serial prefixed `CARD-T2-` for audit trail.

### DB changes (trigger2_migration.sql — run separately)
- `progressive.must_hit_by` column added — random threshold between seed and ceiling
- `progressive_random_threshold()` helper RPC
- `fn_progressive_threshold_check()` trigger function — fires on every UPDATE of progressive.value, arms jackpot when value >= must_hit_by, picks new threshold
- `trg_progressive_threshold` trigger on progressive table
- `progressive_contribute()` RPC updated
- `progressive_hit()` RPC — resets pot, picks new threshold
- Current stuck pot at $26,800 unstuck: must_hit_by set to seed — fires on first spin after deploy

### Version bump
| File | Change |
|------|--------|
| `service-worker.js` | `CACHE = 'mwc-v106'` |
| `index.html` | title, splash-ver, all `?v=` → `1.06` |

---

## 1.07 — CRITICAL FIX: _checkArmedCommand on connect

**Root cause:** Game `progressive.js` never polled `progressive_commands` for
existing armed rows on connect. `_forceArmed` only set via realtime INSERT
event. Players who connected after Trigger 2 armed the command missed the
event entirely — `isForceArmed()` always returned false, guaranteed Lazy-T
card never generated, jackpot stuck indefinitely.

**Fix:** Added `_checkArmedCommand()` — polls `progressive_commands` for any
`force_jackpot/armed` row on connect and sets `_forceArmed/_forceCommandId`
immediately. Also re-checks every 30 seconds via `setInterval` to catch any
commands armed while the player is mid-session.

**Files changed:** `js/progressive.js`

### Version bump
| File | Change |
|------|--------|
| `service-worker.js` | `CACHE = 'mwc-v107'` |
| `index.html` | title, splash-ver, all `?v=` → `1.07` |

---

## 1.08 — Race condition fix + operator UI redesign

### Changes
- `js/progressive.js`: Added `tryAtomicClaim(onResult)` — atomically pre-claims armed `progressive_commands` row before guaranteed Lazy-T card is generated. Only one client can succeed; all others fall back to normal card. Prevents multiple simultaneous guaranteed Lazy-T wins.
- `js/game.js`: Trigger 2 check now calls `Progressive.tryAtomicClaim()` async before card generation. Added `_continueDoBingoSpin(prevBallPos)` to support the async path — extracts post-card evaluation logic so the spin can resume after the DB round-trip.

### Version bump
| File | Change |
|------|--------|
| `service-worker.js` | `CACHE = 'mwc-v108'` |
| `index.html` | title, splash-ver, all `?v=` → `1.08` |

---

## v1.05 — coverall → lazyt + none stop fix + Lazy-T comment fix
- `js/paytable.js`: `'coverall'` → `'lazyt'`; `REEL_SYMS['none']` `[4,2,3]` → `[6,4,6]`; Lazy-T comment corrected
- `js/game.js`: `REEL_SYMS['coverall']` → `REEL_SYMS['lazyt']`; comment updated
- Cache: `mwc-v105`

## v1.06 — Trigger 2: server-side threshold + guaranteed Lazy-T card
- `js/progressive.js`: Added `isForceArmed()`
- `js/game.js`: Added `_genGuaranteedLazyTCard()` + Trigger 2 check
- Cache: `mwc-v106`

## v1.07 — CRITICAL FIX: _checkArmedCommand on connect
- `js/progressive.js`: Added `_checkArmedCommand()` polling on connect and every 30s
- Cache: `mwc-v107`

## v1.08 — Race condition fix: tryAtomicClaim + _continueDoBingoSpin
- `js/progressive.js`: Added `tryAtomicClaim(onResult)`
- `js/game.js`: Added `_continueDoBingoSpin(prevBallPos)`, async Trigger 2 path
- Cache: `mwc-v108`

## v1.09 — CRITICAL FIX: service-worker non-fatal pre-cache
- `service-worker.js`: `.catch()` added to `c.addAll(FILES)` — 404s no longer block SW install
- Cache: `mwc-v109`

---

## 1.10 — CRITICAL FIX: winPatterns undefined crash on spin
- `js/game.js`: `doBingoSpin()` return value renamed to `_spinResult`. Added null guard (WABC bail-out) and undefined guard (async Trigger 2 path). `_continueDoBingoSpin()` now calls `_continueSpinAfterClaim()` directly via typeof check. Removed duplicate `_continueSpinAfterClaim` invocation that caused double-spin on Trigger 2 path.
- Cache: `mwc-v110`

---

## 1.11 — CRITICAL FIX: Spin lockup from async Trigger 2 refactor
**Root cause:** `_continueSpinAfterClaim()` is defined inside `doSpin()` as a closure and cannot be called from the top-level `_continueDoBingoSpin()` function. The async Trigger 2 path silently failed because `typeof _continueSpinAfterClaim === 'function'` was always `false` outside `doSpin()`, so the spin continuation never ran. Every spin exited early — no reels, no win, no error.

**Fix:** Reverted Trigger 2 to a purely synchronous design. `tryAtomicClaim()` and the async DB round-trip removed entirely. `isForceArmed()` check runs synchronously — if true, `_genGuaranteedLazyTCard()` replaces the card in-place, then normal spin flow continues. Race protection is handled by `armAndClaim()` which already has an atomic race guard. `_continueDoBingoSpin()` no longer attempts to call `_continueSpinAfterClaim()`. `doSpin()` restored to original `var winPatterns=doBingoSpin()` + null check pattern.

**Files changed:** `js/game.js`, `js/progressive.js` (`tryAtomicClaim` removed from API)
- Cache: `mwc-v111`
