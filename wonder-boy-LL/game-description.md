# Island Runner — Game Comments

## Title
**Island Runner** — A Wonder Boy-inspired arcade platformer

## Description
Island Runner is an original educational arcade platformer inspired by the visual mood and mechanics of the 1986 Wonder Boy arcade game. The player controls a jungle explorer who must sprint through 5 increasingly difficult levels, collecting fruit, defeating enemies, and reaching the golden arch finish marker before a creeping wall of darkness catches them.

All visuals are drawn entirely with the HTML5 Canvas API — no copyrighted sprites or assets from the original Wonder Boy game are used.

## Controls

| Action | Keys |
|---|---|
| Move right | `ArrowRight` or `D` |
| Move left | `ArrowLeft` or `A` |
| Jump | `Space`, `ArrowUp`, or `W` |
| Attack / throw | `X` or `J` (requires weapon power-up) |
| Pause | `Escape` or `P` |
| Restart | `R` (from pause, game over, or victory) |

Hold jump for variable height. The camera never scrolls left — you cannot retreat past the danger wall.

## Mechanics

### Vitality System
- Vitality is the only survival resource (no lives).
- Vitality drains continuously over time.
- Collecting apples (+20%) and bananas (+30%) restores vitality.
- Enemy contact and hazards reduce vitality.
- Vitality 0 → immediate Game Over.

### Chasing Danger
- A creeping fire wall advances from the left at increasing speed each level.
- If it reaches the player → immediate Game Over.
- Forces the player to keep moving forward.

### Enemies
- **Snails**: Slow ground patrol. Can be stomped from above (+200 pts) or hit with a thrown weapon.
- **Bats**: Fly in a sine-wave pattern. Cannot be stomped — require the weapon power-up.
- **Spiders**: Drop from above on a thread. Can be stomped or hit with a thrown weapon.

### Weapon Power-Up
- Collect the cyan star pickup to enable throwing for 10 seconds.
- Press `X` or `J` to throw an orange projectile forward.
- Defeats any enemy on contact.

### Items
| Item | Effect |
|---|---|
| Gold coin | +50 score |
| Apple | +100 score, +20% vitality |
| Banana | +150 score, +30% vitality |
| Weapon star | Enable throw attack for 10 s |

### Dual Routes
Each level offers a safe low road (fewer collectibles, easier) and a riskier upper route with more coins and bananas. Choose your path — fast and safe, or slow and rewarding.

### Hazards
- **Spikes**: Placed in pit floors; reduce vitality on contact.
- **Fire**: Flickering flame hazards on later levels; reduce vitality on contact.
- **Pits**: Falling off the bottom of the screen → immediate Game Over.

## Level Progression

| Level | Title | Width | New elements |
|---|---|---|---|
| 1 | Jungle Awakening | 3200 px | Wide platforms, snails only |
| 2 | Deeper Forest | 4000 px | Gaps appear, bats introduced |
| 3 | Rocky Cliffs | 4800 px | Bigger gaps, moving platform, spiders, spike hazards |
| 4 | Treetop Village | 5600 px | Narrow platforms, faster danger, more spiders |
| 5 | Volcano Peak | 6400 px | Very narrow platforms, fire hazards, fastest danger |

## Scoring & Ranking

### Point Values
| Source | Points |
|---|---|
| Coin | 50 |
| Apple | 100 |
| Banana | 150 |
| Enemy defeated | 200 |
| Level complete | 500 |
| Time bonus | 0–1000 per level |

### Ranking
- 10 fixed mock players are shown.
- Your score (`YOU`) is inserted at the correct position.
- Ties: `YOU` is placed below existing players with the same score.
- To reach **rank 1**, complete all 5 levels quickly and collect most items.
- **Rank 10** is achievable even with an early game over on level 1.
- Ranking is memory-only — not saved on reload.

## Privacy Note
- No personal data, cookies, localStorage, or analytics of any kind.
- No external network requests.
- No accounts, logins, or persistent storage.
- All data (score, ranking) is discarded when the page is closed.

## Copyright Note
- This is an original work. No Wonder Boy sprites, music, level maps, or screenshots are used at runtime.
- The three reference images in `resources/images/` are screenshots from the original 1986 Wonder Boy (© Sega/Westone) used only during development to study visual mood and color palette. They are never loaded or rendered by the game.
- The title "Island Runner" and all visual assets are original creations.

## Testing Notes

### How to Run
Open `wonder-boy-LL/index.html` directly in Chrome (no server required).

### Checklist
- [ ] No console errors on load.
- [ ] All `src/*.js` modules load as ES modules (verify in DevTools → Network tab).
- [ ] Start screen shows title, controls, and privacy note.
- [ ] Player moves right/left; camera scrolls right only.
- [ ] Jump works with `Space`/`ArrowUp`/`W`; hold for extra height.
- [ ] Stomping snail from above: +200 pts, player bounces.
- [ ] Bat contact drains vitality; bat cannot be stomped.
- [ ] Weapon pickup enables throw (`X`/`J`); projectile defeats bat.
- [ ] Vitality drains continuously; apple/banana restore it.
- [ ] Vitality 0 → Game Over screen (cause: "Vitality depleted!").
- [ ] Falling into pit → Game Over (cause: "Fell into a pit!").
- [ ] Danger wall catches player → Game Over (cause: "The darkness consumed you!").
- [ ] Reach finish arch → Level Complete splash → next level loads.
- [ ] All 5 levels are playable end-to-end.
- [ ] Level 5 finish → Victory screen with ranking; `YOU` at correct position.
- [ ] Restart from Game Over resets score, starts Level 1.
- [ ] Pause (`Escape`) halts game; resume continues.
- [ ] No lives system — only vitality and immediate-failure conditions.
- [ ] Run `python index-videogames.py` from repo root → `wonder-boy-LL` appears in the index.
