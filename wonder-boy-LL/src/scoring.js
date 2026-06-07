import { VITALITY_MAX, SCORE_LEVEL, SCORE_TIME_MAX, MOCK_PLAYERS } from './config.js';
import { state } from './gameState.js';

export function addScore(points) {
  state.score += points;
}

export function addVitality(amount) {
  state.vitality = Math.max(0, Math.min(VITALITY_MAX, state.vitality + amount));
}

export function calcTimeBonus(levelStartTime) {
  const elapsed = (performance.now() - levelStartTime) / 1000;
  // Full bonus below 40s, linear decay, zero at 140s
  const bonus = Math.max(0, Math.round(SCORE_TIME_MAX * (1 - elapsed / 140)));
  return bonus;
}

export function applyLevelBonus(levelStartTime) {
  const bonus = calcTimeBonus(levelStartTime);
  addScore(SCORE_LEVEL + bonus);
  return bonus;
}

export function buildRanking(finalScore) {
  const table = MOCK_PLAYERS.map(p => ({ ...p }));
  // Insert YOU below any equal scores (per spec)
  let inserted = false;
  for (let i = 0; i < table.length; i++) {
    if (finalScore > table[i].score) {
      table.splice(i, 0, { name: 'YOU', score: finalScore });
      inserted = true;
      break;
    }
  }
  if (!inserted) table.push({ name: 'YOU', score: finalScore });
  return table;
}
