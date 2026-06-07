import { DANGER_SPEED, VITALITY_DRAIN_RATE } from './config.js';
import { state, resetForLevel, resetAll } from './gameState.js';
import { initInput, consumeKey } from './input.js';
import { initRenderer, render } from './renderer.js';
import { initUI, drawStartScreen, drawPauseScreen, drawLevelComplete, drawGameOver, drawVictory } from './ui.js';
import { LEVELS } from './levels.js';
import { createPlayer, updatePlayer, updateSnail, updateBat, updateSpider, updateProjectiles, updateMovingPlatforms } from './entities.js';
import { applyGravity, moveEntity, handleJump, resolvePlatformCollisions, updateCamera, advanceDanger, isInPit } from './physics.js';
import { checkCollisions, checkProjectileCollisions, checkDangerCaught } from './collisions.js';
import { addVitality, applyLevelBonus, buildRanking } from './scoring.js';

const canvas = document.getElementById('gameCanvas');
initInput();
initRenderer(canvas);
initUI(canvas);

let entities = [];
let platforms = [];
let player = null;
let lastTime = null;
let t = 0;

let levelCompleteTimer = 0;
let levelCompleteBonusScore = 0;
const LEVEL_COMPLETE_DELAY = 2.5;

let gameOverCause = 'vitality';
let finalRanking = null;

// ── Level loading ─────────────────────────────────────────────────────────────

function loadLevel(index) {
  const lvl = LEVELS[index];
  resetForLevel(index);
  platforms = lvl.platforms.map(p => ({ ...p, moveBase: p.x }));
  entities = lvl.entities.map(e => ({ ...e }));
  player = createPlayer(60, 320);
  entities.push(player);
}

function startGame() {
  resetAll();
  loadLevel(0);
}

function handleRestart() {
  lastTime = null;
  finalRanking = null;
  startGame();
}

// ── Global keyboard events (R to restart, Enter for menus) ───────────────────

window.addEventListener('keydown', e => {
  if (e.key === 'r' || e.key === 'R') {
    if (state.screen === 'gameover' || state.screen === 'paused' || state.screen === 'victory') {
      handleRestart();
    }
  }
  if (e.key === 'Enter') {
    if (state.screen === 'start') { startGame(); }
    else if (state.screen === 'gameover' || state.screen === 'victory') { handleRestart(); }
  }
});

canvas.addEventListener('click', () => {
  if (state.screen === 'start') startGame();
  if (state.screen === 'gameover' || state.screen === 'victory') handleRestart();
});

// ── Update functions ──────────────────────────────────────────────────────────

function updateStart(dt) {
  drawStartScreen(t);
  if (consumeKey('jump') || consumeKey('right')) startGame();
}

function updatePlaying(dt) {
  const lvl = LEVELS[state.level];

  if (consumeKey('pause')) {
    state.screen = 'paused';
    return;
  }

  // Vitality drain
  addVitality(-VITALITY_DRAIN_RATE * dt);

  // Player
  updatePlayer(player, dt, platforms, entities, lvl.width);
  handleJump(player);
  applyGravity(player, dt);
  moveEntity(player, dt);
  resolvePlatformCollisions(player, platforms);

  // Clamp player to camera left edge
  if (player.x < state.cameraX) {
    player.x = state.cameraX;
    if (player.vx < 0) player.vx = 0;
  }

  // Enemies
  for (const e of entities) {
    if (e.dead) continue;
    if (e.type === 'snail')   updateSnail(e, dt, platforms);
    if (e.type === 'bat')     updateBat(e, dt, t);
    if (e.type === 'spider')  updateSpider(e, dt);
  }

  updateProjectiles(entities, dt, lvl.width);
  updateMovingPlatforms(platforms, dt);

  // Collisions
  const result = checkCollisions(player, entities);
  checkProjectileCollisions(entities);

  // Camera & danger
  updateCamera(player, lvl.width);
  advanceDanger(dt, DANGER_SPEED[state.level]);

  // Failure checks
  if (state.vitality <= 0) {
    gameOverCause = 'vitality';
    state.screen = 'gameover';
    return;
  }
  if (isInPit(player)) {
    gameOverCause = 'pit';
    state.screen = 'gameover';
    return;
  }
  if (checkDangerCaught(player)) {
    gameOverCause = 'danger';
    state.screen = 'gameover';
    return;
  }

  // Level finish
  if (result === 'finish') {
    levelCompleteBonusScore = applyLevelBonus(state.levelStartTime);
    levelCompleteTimer = LEVEL_COMPLETE_DELAY;
    state.screen = 'levelComplete';
    return;
  }

  render(entities, platforms, t);
}

function updatePaused(dt) {
  render(entities, platforms, t);
  drawPauseScreen();
  if (consumeKey('pause')) {
    state.screen = 'playing';
    lastTime = null; // prevent dt spike on resume
  }
}

function updateLevelComplete(dt) {
  render(entities, platforms, t);
  drawLevelComplete(state.level, levelCompleteBonusScore);

  levelCompleteTimer -= dt;
  if (levelCompleteTimer <= 0) {
    const next = state.level + 1;
    if (next >= LEVELS.length) {
      finalRanking = buildRanking(state.score);
      state.screen = 'victory';
    } else {
      loadLevel(next);
    }
  }
}

function updateGameOver(dt) {
  render(entities, platforms, t);
  drawGameOver(state.score, gameOverCause);
  if (consumeKey('jump') || consumeKey('right')) handleRestart();
}

function updateVictory(dt) {
  drawVictory(state.score, finalRanking);
  if (consumeKey('jump') || consumeKey('right')) handleRestart();
}

// ── Main loop ─────────────────────────────────────────────────────────────────

function loop(timestamp) {
  if (lastTime === null) lastTime = timestamp;
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;
  t += dt;

  switch (state.screen) {
    case 'start':         updateStart(dt);         break;
    case 'playing':       updatePlaying(dt);        break;
    case 'paused':        updatePaused(dt);         break;
    case 'levelComplete': updateLevelComplete(dt);  break;
    case 'gameover':      updateGameOver(dt);       break;
    case 'victory':       updateVictory(dt);        break;
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
