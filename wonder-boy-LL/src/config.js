export const CANVAS_W = 800;
export const CANVAS_H = 480;

export const GRAVITY = 1400;        // px/s²
export const JUMP_FORCE = -620;     // px/s (initial vertical velocity)
export const WALK_SPEED = 200;      // px/s
export const PROJECTILE_SPEED = 480; // px/s

export const PLAYER_W = 28;
export const PLAYER_H = 42;

export const HUD_H = 36;           // pixels reserved for the HUD bar

// Vitality
export const VITALITY_MAX = 100;
export const VITALITY_DRAIN_RATE = 0.5; // % per second (drains fully in 200 s at rest)
export const VITALITY_ENEMY_HIT = 25;
export const VITALITY_HAZARD_HIT = 30;
export const VITALITY_APPLE = 20;
export const VITALITY_BANANA = 30;

// Weapon power-up duration in seconds
export const WEAPON_DURATION = 10;

// Scoring
export const SCORE_COIN = 50;
export const SCORE_APPLE = 100;
export const SCORE_BANANA = 150;
export const SCORE_ENEMY = 200;
export const SCORE_LEVEL = 500;
export const SCORE_TIME_MAX = 1000; // max time bonus per level

// Chasing danger speed (px/s) per level index [0..4]
export const DANGER_SPEED = [20, 28, 38, 50, 65];

// Controls
export const KEYS = {
  right:  ['ArrowRight', 'd', 'D'],
  left:   ['ArrowLeft',  'a', 'A'],
  jump:   ['ArrowUp',    'w', 'W', ' '],
  attack: ['x', 'X', 'j', 'J'],
  pause:  ['Escape', 'p', 'P'],
};

// Mock ranking
export const MOCK_PLAYERS = [
  { name: 'ACE', score: 18500 },
  { name: 'MIA', score: 16200 },
  { name: 'ZED', score: 14100 },
  { name: 'RIO', score: 11900 },
  { name: 'KAI', score:  9800 },
  { name: 'NIA', score:  7600 },
  { name: 'MAX', score:  5400 },
  { name: 'BOB', score:  3200 },
  { name: 'LUX', score:  1800 },
  { name: 'ROK', score:   400 },
];
