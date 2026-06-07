import { VITALITY_MAX } from './config.js';

// Screens: 'start' | 'playing' | 'paused' | 'levelComplete' | 'gameover' | 'victory'
export const state = {
  screen: 'start',
  level: 0,          // 0-based index into levels array
  score: 0,
  vitality: VITALITY_MAX,
  weaponActive: false,
  weaponTimer: 0,    // seconds remaining
  levelStartTime: 0, // timestamp (ms) when level began
  dangerX: -200,     // world-x of the danger wall's right edge (200px behind camera start)
  cameraX: 0,        // world-x of the camera's left edge
};

export function resetForLevel(levelIndex) {
  state.level = levelIndex;
  state.vitality = VITALITY_MAX;
  state.weaponActive = false;
  state.weaponTimer = 0;
  state.levelStartTime = performance.now();
  state.dangerX = -200;
  state.cameraX = 0;
  state.screen = 'playing';
}

export function resetAll() {
  state.score = 0;
  resetForLevel(0);
}
