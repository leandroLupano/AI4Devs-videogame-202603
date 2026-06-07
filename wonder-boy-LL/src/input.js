import { KEYS } from './config.js';

const held = new Set();

export function initInput() {
  window.addEventListener('keydown', e => {
    held.add(e.key);
    // Prevent page scroll on space/arrow keys
    if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }
  });
  window.addEventListener('keyup', e => held.delete(e.key));
}

export function isDown(action) {
  return KEYS[action].some(k => held.has(k));
}

export function consumeKey(action) {
  for (const k of KEYS[action]) {
    if (held.has(k)) { held.delete(k); return true; }
  }
  return false;
}
