import { CANVAS_W, CANVAS_H } from './config.js';

let ctx;

export function initUI(canvas) {
  ctx = canvas.getContext('2d');
}

// ── helpers ───────────────────────────────────────────────────────────────────

function overlay(alpha = 0.6) {
  ctx.fillStyle = `rgba(0,0,0,${alpha})`;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

function centeredText(text, y, size, color = '#fff', font = '"Courier New", monospace') {
  ctx.font = `${size}px ${font}`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(text, CANVAS_W / 2, y);
  ctx.textAlign = 'left';
}

function panel(x, y, w, h, fill = '#111', stroke = '#555') {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
}

// ── start screen ──────────────────────────────────────────────────────────────

export function drawStartScreen(t) {
  // Animated sky background
  const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  sky.addColorStop(0, '#87CEEB');
  sky.addColorStop(1, '#b8e4f9');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Ground strip
  ctx.fillStyle = '#3CB043';
  ctx.fillRect(0, CANVAS_H - 80, CANVAS_W, 30);
  ctx.fillStyle = '#228B22';
  ctx.fillRect(0, CANVAS_H - 50, CANVAS_W, 50);

  overlay(0.3);

  // Title with drop shadow
  ctx.font = 'bold 52px "Courier New", monospace';
  ctx.fillStyle = '#000a';
  ctx.textAlign = 'center';
  ctx.fillText('ISLAND RUNNER', CANVAS_W / 2 + 3, 103);
  ctx.fillStyle = '#f5d020';
  ctx.fillText('ISLAND RUNNER', CANVAS_W / 2, 100);
  ctx.textAlign = 'left';

  centeredText('A Wonder Boy-inspired adventure', 138, 16, '#ddf');

  // Controls panel
  const px = CANVAS_W / 2 - 190;
  panel(px, 160, 380, 180, '#0009', '#555');

  ctx.font = 'bold 14px "Courier New", monospace';
  ctx.fillStyle = '#ff0';
  ctx.fillText('CONTROLS', px + 140, 185);

  ctx.font = '13px "Courier New", monospace';
  ctx.fillStyle = '#ddd';
  const controls = [
    ['Move Right', 'Arrow Right / D'],
    ['Move Left',  'Arrow Left / A'],
    ['Jump',       'Space / Arrow Up / W'],
    ['Attack',     'X or J  (weapon required)'],
    ['Pause',      'Escape / P'],
  ];
  controls.forEach(([label, key], i) => {
    ctx.fillStyle = '#aaa';
    ctx.fillText(label, px + 20, 208 + i * 22);
    ctx.fillStyle = '#fff';
    ctx.fillText(key, px + 150, 208 + i * 22);
  });

  // Objective
  centeredText('Survive 5 levels — collect fruit, defeat enemies,', 365, 13, '#cfc');
  centeredText('reach the golden arch before the darkness catches you!', 382, 13, '#cfc');

  // Start button with pulse
  const pulse = 0.7 + Math.sin(t * 3) * 0.3;
  ctx.globalAlpha = pulse;
  panel(CANVAS_W / 2 - 100, 400, 200, 44, '#1a8a1a', '#4ccc4c');
  ctx.font = 'bold 20px "Courier New", monospace';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.fillText('PRESS ENTER / CLICK', CANVAS_W / 2, 428);
  ctx.textAlign = 'left';
  ctx.globalAlpha = 1;

  // Privacy note
  ctx.font = '10px "Courier New", monospace';
  ctx.fillStyle = '#888';
  ctx.textAlign = 'center';
  ctx.fillText('Original game. No Wonder Boy assets used. No personal data collected. No cookies.', CANVAS_W / 2, CANVAS_H - 10);
  ctx.textAlign = 'left';
}

// ── pause overlay ─────────────────────────────────────────────────────────────

export function drawPauseScreen() {
  overlay(0.55);
  panel(CANVAS_W / 2 - 140, CANVAS_H / 2 - 60, 280, 120, '#111c', '#777');
  centeredText('PAUSED', CANVAS_H / 2 - 18, 32, '#fff');
  centeredText('Press ESC / P to resume', CANVAS_H / 2 + 22, 14, '#aaa');
  centeredText('Press R to restart', CANVAS_H / 2 + 44, 14, '#aaa');
}

// ── level complete splash ─────────────────────────────────────────────────────

export function drawLevelComplete(levelIndex, bonusScore) {
  overlay(0.5);
  panel(CANVAS_W / 2 - 200, CANVAS_H / 2 - 70, 400, 140, '#0a0a0a', '#f5d020');
  centeredText(`LEVEL ${levelIndex + 1} COMPLETE!`, CANVAS_H / 2 - 30, 28, '#f5d020');
  centeredText(`Time Bonus: +${bonusScore}`, CANVAS_H / 2 + 10, 18, '#fff');
  centeredText('Get ready for the next level...', CANVAS_H / 2 + 42, 14, '#aaa');
}

// ── game over ─────────────────────────────────────────────────────────────────

export function drawGameOver(score, cause) {
  overlay(0.65);
  panel(CANVAS_W / 2 - 200, CANVAS_H / 2 - 90, 400, 180, '#1a0000', '#cc2222');
  centeredText('GAME OVER', CANVAS_H / 2 - 48, 36, '#ff4444');

  const msg = {
    vitality: 'Vitality depleted!',
    pit:      'Fell into a pit!',
    danger:   'The darkness consumed you!',
  }[cause] || 'You died!';

  centeredText(msg, CANVAS_H / 2 - 8, 16, '#ffaaaa');
  centeredText(`Final Score: ${String(score).padStart(7, '0')}`, CANVAS_H / 2 + 24, 18, '#fff');
  centeredText('Press R or ENTER to restart', CANVAS_H / 2 + 58, 14, '#aaa');
}

// ── victory & ranking ─────────────────────────────────────────────────────────

export function drawVictory(finalScore, ranking) {
  overlay(0.1);

  // Gold banner
  const bx = CANVAS_W / 2 - 220;
  panel(bx, 20, 440, 50, '#2a1a00', '#f5d020');
  centeredText('YOU WIN! FINAL SCORE: ' + String(finalScore).padStart(7, '0'), 54, 20, '#f5d020');

  // Ranking table
  const rx = CANVAS_W / 2 - 160;
  const rw = 320;
  panel(rx, 88, rw, 20, '#111', '#444');
  ctx.font = 'bold 13px "Courier New", monospace';
  ctx.fillStyle = '#f5d020';
  ctx.fillText('RANK  NAME     SCORE', rx + 16, 103);

  ranking.forEach((entry, i) => {
    const ry = 110 + i * 26;
    const isYou = entry.name === 'YOU';
    panel(rx, ry, rw, 24, isYou ? '#1a3a1a' : (i % 2 === 0 ? '#1a1a1a' : '#111'), 'transparent');

    ctx.font = isYou ? 'bold 14px "Courier New", monospace' : '13px "Courier New", monospace';
    ctx.fillStyle = isYou ? '#4cff4c' : (i < 3 ? '#f5d020' : '#ccc');

    const rankStr = String(i + 1).padStart(2, ' ');
    ctx.fillText(`${rankStr}.   ${entry.name.padEnd(6)} ${String(entry.score).padStart(7, '0')}`, rx + 16, ry + 17);
  });

  centeredText('Press R or ENTER to play again', 400, 14, '#aaa');
}
