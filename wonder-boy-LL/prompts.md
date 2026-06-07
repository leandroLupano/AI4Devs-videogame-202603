# Prompts-LL

---
## Prompt 1:
- Model: Codex 5.5 plan-mode.

# Role:
You are an expert software engineer specialized in video game development using AI agents.

# Context:
This repository was cloned to create a web video game. It contains an example of snake game in @snake-EHS.

I want to create a game similar to the 1986 arcade game Wonder Boy.
You can find some useful information about this game in the following links, which you can access through Google Chrome:
- https://en.wikipedia.org/wiki/Wonder_Boy_(video_game)
- https://www.youtube.com/watch?v=4c5ttRe_wMQ 

The theoretical information for the module is located in the @theory.md file.

The development instructions are located in the @instructions.md file.

The repository information is located in the @README.md file.

# Task:
Read the base repository and its @README.md to understand its current structure without modifying anything.

Generate a complete prompt to run in an AI agent in order to create a web video game similar to wonder boy arcade game of 1986 based on the @instructions.md file.

You must consider the information, best practices, and recommendations described in the @theory.md file.

You should consider creating a simple MVP version of this arcade-style video game.

Do not modify any files.

Everything must be done in English.

Do not make any assumptions. If you need additional information, you must ask me.

I want the prompt to include instructions for the agent to first generate a plan that must be approved before modifying any files.

I want the prompt to instruct the agent not to make any assumptions when creating the plan. If any information is missing, unclear, or required to make a decision, the agent must ask questions before proceeding. The plan must be based only on confirmed information.





---
## Prompt 2:
- Model: Claude Code auto-mode.

# Wonder Boy-Inspired MVP Game Prompt

## Role:
You are an expert software engineer specialized in video game development using AI agents.

## Summary
Build an original educational arcade platformer in `wonder-boy-LL`, inspired by classic Wonder Boy mechanics without copying copyrighted assets. The folder `wonder-boy-LL/resources/images` is valid and must be kept. The images there must be used as visual reference only, unless they are explicitly confirmed to be legally usable as runtime assets.

Before modifying any file, the AI agent must first inspect the repository and present an implementation plan. No files may be created, edited, renamed, or deleted until the user explicitly approves that plan.

The agent must not make assumptions when creating the plan. If any information is unclear, missing, contradictory, or needed to make an implementation decision, the agent must ask all necessary questions first. The final plan must be based only on confirmed repository facts and confirmed user answers.

## Required Agent Workflow
- Read first:
    - `README.md`
    - `exercise-instructions.md`
    - `module-theory.md`
    - `snake-EHS`
    - `index-videogames.py`
    - `wonder-boy-LL/prompts.md`
    - `wonder-boy-LL/resources/images`
- Do not assume missing requirements.
- If anything is unclear, ask questions before planning.    
- Present a concise implementation plan covering:
    - files to create or edit
    - modular JavaScript architecture
    - gameplay mechanics
    - level progression
    - scoring/ranking
    - privacy/copyright decisions
    - testing approach
- Wait for explicit user approval before editing files.
- Do not modify root repository files or the Snake example.

## Technical Architecture
Use plain HTML, CSS, and JavaScript with ES Modules. No framework, backend, bundler, package manager, analytics, cookies, or external APIs.

Use this structure unless repository inspection reveals a confirmed incompatibility:
```text
wonder-boy-LL/
  index.html
  styles.css
  game-description.md
  prompts.md
  resources/
    images/
      wonder-boy-01.png
      wonder-boy-02.png
      wonder-boy-03.png
  src/
    main.js
    config.js
    gameState.js
    input.js
    levels.js
    entities.js
    physics.js
    collisions.js
    scoring.js
    renderer.js
    ui.js
```
Module responsibilities:

- main.js: bootstraps the game, owns the loop, coordinates update/render.
- config.js: canvas size, constants, controls, scoring values, difficulty settings.
- gameState.js: current level, score, vitality, player state, mode transitions.
- input.js: keyboard handling.
- levels.js: 5 level definitions and difficulty progression.
- entities.js: player, enemies, items, projectiles, hazards, finish markers.
- physics.js: movement, gravity, jumping, platform resolution.
- collisions.js: collision detection and collision outcomes.
- scoring.js: item points, time bonus, final ranking insertion.
- renderer.js: Canvas rendering, camera, background, HUD drawing helpers.
- ui.js: start screen, pause/restart, game over, victory, ranking views.
Keep modules small and explicit. Avoid overengineering, but separate responsibilities like a senior game engineer would for maintainability.

- Use resources/images/ as reference material for:
    - color palette
    - arcade HUD style
    - jungle/island platform mood
    - enemy and obstacle silhouettes
    - level pacing
- Create original simplified visuals using Canvas, CSS, or original placeholder sprites.
- Use the HTML5 Canvas API for rendering the game.

## Gameplay
- Add a start window with title, objective, controls, start button, and brief privacy/copyright note.
- Player controls:
    - Move forward/right with `ArrowRight` or `D`.
    - Jump with `Space`, `ArrowUp`, or `W`.
    - Attack/throw with `X` or `J` if weapon power-up is active.
    - No backward movement beyond the camera boundary.
- Add 5 sequential levels.
- Each level has platforms, gaps, enemies, hazards, collectibles, and a finish marker.
- Difficulty increases each level.
- Add a slow chasing danger behind the player to force forward movement. If it catches the player, the game is over.
- Place fruit so the player must choose between a faster route and a riskier route with more score/vitality rewards.
- Finish level 5 to show final score and ranking.

## Scoring And Ranking
- Coins, enemies defeated, level completion, and time bonus increase score.
- Vitality is the only survival resource; there is no lives system.
- Vitality starts full at the beginning of each level.
- Vitality decreases continuously over time.
- Apples and bananas restore vitality and add score.
- Enemies and hazards reduce vitality.
- If vitality reaches 0, the game is over.
- Falling into a pit or being caught by the chasing danger causes immediate game over.
- Maintain ranking in memory only.
- Show 10 mock players plus `YOU` inserted at the correct score position.
- If scores are tied, place `YOU` below existing mock players with the same score.
- Mock scores must allow:
    - rank 1 only for a fast near-perfect 5-level run
    - rank 10 for someone who loses during level 1
Example mock scores:
```text
ACE 18500
MIA 16200
ZED 14100
RIO 11900
KAI 9800
NIA 7600
MAX 5400
BOB 3200
LUX 1800
ROK 400
```

## Privacy, Copyright, And Documentation
- No personal data, analytics, cookies, backend calls, external APIs, accounts, or persistent storage.
- Do not copy Wonder Boy sprites, music, maps, screenshots, exact branding, or level layouts.
- Use `resources/images` only as visual references for palette, mood, HUD style, enemy silhouettes, and level pacing.
- `prompts.md` must document prompts used, reference image usage, AI-assisted development, privacy, and copyright considerations.
- `game-description.md` must include title, description, controls, mechanics, level progression, scoring/ranking, privacy note, and testing notes.

## Test Plan
- Open `wonder-boy-LL/index.html` in Chrome.
- Verify ES modules load correctly via `<script type="module" src="./src/main.js"></script>`.
- Verify start screen, movement, jump, attack, collisions, items, vitality decay, vitality recovery, score, power-ups, chaser, level transitions, game over, victory, restart, and final ranking.
- Verify all 5 levels are playable.
- Verify there are no console errors.
- Verify there is no lives system; player survival depends only on vitality and immediate-failure hazards.

## Assumptions
- No implementation assumptions may be made by the agent. Any uncertain detail must be resolved through repository inspection or explicit user questions before presenting the plan.
- Everything must be written in English.





---
## Prompt 3:
- Model: Claude Code auto-mode.

# Role
You are a senior software engineer and video game QA reviewer. Your task is to verify that the `wonder-boy-LL` game is functional, complete, and compliant with the exercise requirements.

# Context
This repository contains a web video game exercise. The game to review is located in:
`wonder-boy-LL`

Relevant repository files:
- `README.md`
- `exercise-instructions.md`
- `module-theory.md`
- `index-videogames.py`
- `snake-EHS`
- `wonder-boy-LL/prompts.md`
- `wonder-boy-LL/game-description.md`
- `wonder-boy-LL/index.html`
- `wonder-boy-LL/styles.css`
- `wonder-boy-LL/src/`

# Task
Inspect the repository and verify the game without modifying any files.

You must check whether the implementation satisfies:
- the exercise requirements
- the prompt documented in `wonder-boy-LL/prompts.md`
- good HTML/CSS/JavaScript game development practices
- privacy-by-design and copyright constraints from the module theory

# Verification Scope

## Repository Compliance
Verify that:
- The game is contained inside `wonder-boy-LL`.
- Required files exist:
  - `index.html`
  - `styles.css`
  - `game-description.md`
  - `prompts.md`
  - JavaScript source files under `src/`
- Root repository files were not unnecessarily modified.
- The game can be discovered by the repository index convention.
- Documentation is written in English.

## Functional Game Review
Verify that:
- The game opens in Chrome.
- There are no browser console errors.
- ES Modules load correctly.
- The start screen appears before gameplay.
- The game can be started, restarted, won, and lost.
- Player movement works.
- Jumping works.
- Attack/projectile behavior works only when the relevant power-up is active.
- The player cannot move backward beyond the camera boundary.
- There are 5 sequential levels.
- Difficulty increases across levels.
- Each level includes platforms, gaps, enemies, hazards, collectibles, and a finish marker.
- The slow chasing danger forces forward movement.
- Being caught by the chaser causes game over.
- Falling into a pit causes game over.
- Completing level 5 shows the final score and ranking.

## Vitality System
Verify that:
- Vitality is the only survival resource.
- There is no lives system.
- Vitality starts full at each level.
- Vitality decreases continuously over time.
- Apples and bananas restore vitality and add score.
- Enemies and hazards reduce vitality.
- Reaching 0 vitality causes game over.

## Scoring And Ranking
Verify that:
- Coins, apples, bananas, defeated enemies, level completion, and time bonus affect score correctly.
- Ranking is in-memory only.
- No personal name is requested.
- `YOU` is inserted correctly among 10 mock players.
- Ties place `YOU` below existing mock players with the same score.
- A strong 5-level run can reasonably reach rank 1.
- A poor level-1 run can reasonably appear near rank 10.

## Privacy And Copyright
Verify that:
- The game does not collect personal data.
- There are no cookies, analytics, trackers, backend calls, external APIs, accounts, or persistent storage.
- Reference images in `resources/images` are not directly copied into runtime gameplay unless explicitly documented as legally usable.
- The game does not copy Wonder Boy sprites, music, maps, exact branding, screenshots, or level layouts.
- `game-description.md` includes a privacy/copyright note.

## Code Quality
Review whether:
- JavaScript modules have clear responsibilities.
- Game loop, rendering, input, state, collision, scoring, and UI are reasonably separated.
- Constants are centralized where appropriate.
- Collision and physics logic are understandable.
- The code is maintainable for an MVP.
- There is no unnecessary overengineering.

# Output Format
Do not modify files.

Return a concise QA report with these sections:

1. Overall verdict: Pass / Pass with issues / Fail
2. Blocking issues
3. Non-blocking issues
4. Requirement checklist
5. Manual test results
6. Privacy/copyright assessment
7. Recommended fixes

For every issue, include:
- file path
- relevant function or section if possible
- severity
- concrete recommendation

If something cannot be verified automatically, say exactly what manual check is required.



---
## AI-Assisted Development Notes

### Reference Image Usage
The three images in `resources/images/` (`wonder-boy-01.png`, `wonder-boy-02.png`, `wonder-boy-03.png`) are screenshots from the original Wonder Boy arcade game (© Sega/Westone, 1986). They were used exclusively as **visual mood references** during the planning phase to extract:
- Color palette: bright blues for sky (`#87CEEB`), rich greens for ground (`#3CB043`, `#228B22`), warm browns for trees (`#8B4513`).
- HUD style: dark top bar, orange/red vitality bar, white monospaced score text.
- Enemy silhouettes: snail shapes (ellipse body + arc shell), bat silhouettes (wing arcs), spider forms.
- Level mood: multi-layered forest/jungle with tall trees, sky visible between canopy, grassy platforms.

None of the reference images are loaded, embedded, or rendered at runtime. All visual assets are drawn entirely with the HTML5 Canvas API using original geometric shapes.

### Copyright Decisions
- No Wonder Boy sprites, music, character designs, level layouts, map data, or branding were reproduced.
- The game title "Island Runner" is original.
- Game mechanics (platforming, vitality bar, fruit collectibles, forward-scrolling with chasing danger) are inspired by the general genre, not copied from any specific implementation.
- The game is an independent educational work created for the AI4Devs course.

### Privacy Decisions
- No `localStorage`, `sessionStorage`, cookies, or IndexedDB usage.
- No analytics, tracking, or external API calls.
- No user accounts, authentication, or personal data collection of any kind.
- Ranking is stored in memory only (JavaScript variables) and discarded on page reload.
- A privacy notice is shown on the start screen.

### Development Process (Claude Code + Claude Sonnet 4.6)
1. **Planning phase**: Claude Code (plan mode) read all repository files and the 3 reference images, then produced a detailed implementation plan covering architecture, level design, scoring math, and copyright decisions. The plan was reviewed and approved before any files were written.
2. **Implementation phase**: All 12 source files were generated in order, following the approved plan: `index.html`, `styles.css`, `config.js`, `gameState.js`, `input.js`, `renderer.js`, `ui.js`, `levels.js`, `entities.js`, `physics.js`, `collisions.js`, `scoring.js`, `main.js`.
3. **Iteration**: Issues found during review (unused imports, broken async import, onclick inside loop, no damage cooldown) were fixed before completion.
