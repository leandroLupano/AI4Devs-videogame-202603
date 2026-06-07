import { CANVAS_W, CANVAS_H, HUD_H } from './config.js';
import { state } from './gameState.js';

let ctx;

export function initRenderer(canvas) {
  ctx = canvas.getContext('2d');
}

// ── background ────────────────────────────────────────────────────────────────

function drawBackground(cameraX) {
  // Sky gradient
  const sky = ctx.createLinearGradient(0, HUD_H, 0, CANVAS_H - 80);
  sky.addColorStop(0, '#87CEEB');
  sky.addColorStop(1, '#b8e4f9');
  ctx.fillStyle = sky;
  ctx.fillRect(0, HUD_H, CANVAS_W, CANVAS_H - HUD_H);

  // Parallax trees (far layer, moves at 30% camera speed)
  drawTrees(cameraX * 0.3, 5, 40, 160, '#2d7a2d', '#6b3a2a');
  // Mid trees (60% camera speed)
  drawTrees(cameraX * 0.6, 8, 55, 200, '#1a5e1a', '#5a3020');
}

function drawTrees(offset, count, trunkW, trunkH, canopyColor, trunkColor) {
  const spacing = CANVAS_W / (count - 1);
  for (let i = 0; i < count; i++) {
    const x = ((i * spacing - (offset % (spacing * count)) + spacing * count) % (CANVAS_W + spacing * 2)) - spacing;
    const baseY = CANVAS_H - 80;

    // Trunk
    ctx.fillStyle = trunkColor;
    ctx.fillRect(x - trunkW / 2, baseY - trunkH, trunkW, trunkH);

    // Canopy (three stacked ellipses)
    ctx.fillStyle = canopyColor;
    for (let j = 0; j < 3; j++) {
      const cy = baseY - trunkH - j * 28;
      const rx = 38 - j * 5;
      const ry = 22 - j * 3;
      ctx.beginPath();
      ctx.ellipse(x, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// ── ground layer ─────────────────────────────────────────────────────────────

function drawGround(platforms, cameraX) {
  for (const p of platforms) {
    const sx = p.x - cameraX;
    if (sx + p.w < 0 || sx > CANVAS_W) continue;

    if (p.moving) {
      // Moving platforms: wooden plank style
      ctx.fillStyle = '#c8843c';
      ctx.fillRect(sx, p.y, p.w, p.h);
      ctx.fillStyle = '#a06030';
      for (let i = 0; i < p.w; i += 20) {
        ctx.fillRect(sx + i, p.y, 2, p.h);
      }
      ctx.strokeStyle = '#7a4820';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx, p.y, p.w, p.h);
    } else {
      // Static platform: grassy top
      ctx.fillStyle = '#3CB043';
      ctx.fillRect(sx, p.y, p.w, 14);
      ctx.fillStyle = '#228B22';
      ctx.fillRect(sx, p.y + 14, p.w, p.h - 14);
      // Grass tufts
      ctx.fillStyle = '#4ccc55';
      for (let i = 4; i < p.w - 4; i += 12) {
        ctx.fillRect(sx + i, p.y - 3, 4, 5);
        ctx.fillRect(sx + i + 4, p.y - 5, 3, 5);
      }
    }
  }
}

// ── entities ──────────────────────────────────────────────────────────────────

function drawPlayer(player, cameraX, t) {
  const sx = player.x - cameraX;
  const sy = player.y;
  const flip = player.facingLeft ? -1 : 1;

  ctx.save();
  ctx.translate(sx + player.w / 2, sy + player.h / 2);
  ctx.scale(flip, 1);

  // Legs animation (only when on ground and moving)
  const legOffset = player.onGround && Math.abs(player.vx) > 10
    ? Math.sin(t * 10) * 5
    : 0;

  // Legs
  ctx.fillStyle = '#f4c470';
  ctx.fillRect(-7, 8, 6, 14 + legOffset);
  ctx.fillRect(2, 8, 6, 14 - legOffset);

  // Body
  ctx.fillStyle = '#f4a340';
  ctx.fillRect(-9, -6, 18, 16);

  // Head
  ctx.fillStyle = '#fcd9a0';
  ctx.beginPath();
  ctx.arc(0, -14, 10, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = '#f5d020';
  ctx.fillRect(-10, -22, 20, 10);
  ctx.beginPath();
  ctx.arc(0, -22, 10, Math.PI, 0);
  ctx.fill();

  // Eye
  ctx.fillStyle = '#333';
  ctx.fillRect(3, -17, 3, 3);

  // Arm (raised if attacking)
  ctx.fillStyle = '#fcd9a0';
  if (player.attacking) {
    ctx.fillRect(9, -10, 10, 5);
  } else {
    ctx.fillRect(9, -4, 6, 10);
  }

  ctx.restore();
}

function drawSnail(e, cameraX, t) {
  const sx = e.x - cameraX;
  const sy = e.y;
  if (sx + e.w < 0 || sx > CANVAS_W) return;

  // Body
  ctx.fillStyle = '#e8c060';
  ctx.beginPath();
  ctx.ellipse(sx + 14, sy + 14, 14, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Shell spiral
  ctx.strokeStyle = '#8b5e20';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(sx + 16, sy + 10, 8, 0, Math.PI * 1.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(sx + 16, sy + 10, 5, 0, Math.PI * 1.2);
  ctx.stroke();

  // Antennae
  ctx.strokeStyle = '#e8c060';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(sx + 6, sy + 6);
  ctx.lineTo(sx + 2, sy);
  ctx.moveTo(sx + 9, sy + 5);
  ctx.lineTo(sx + 8, sy - 1);
  ctx.stroke();

  // Eye dots
  ctx.fillStyle = '#333';
  ctx.fillRect(sx + 1, sy - 1, 2, 2);
  ctx.fillRect(sx + 7, sy - 2, 2, 2);
}

function drawBat(e, cameraX, t) {
  const sx = e.x - cameraX;
  const sy = e.y;
  if (sx + e.w < 0 || sx > CANVAS_W) return;

  const flapAngle = Math.sin(t * 8) * 0.4;
  ctx.save();
  ctx.translate(sx + e.w / 2, sy + e.h / 2);

  // Wings
  ctx.fillStyle = '#5a3a7a';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-20, -18 + flapAngle * 30, -28, -6 + flapAngle * 20);
  ctx.quadraticCurveTo(-14, 8, 0, 4);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(20, -18 + flapAngle * 30, 28, -6 + flapAngle * 20);
  ctx.quadraticCurveTo(14, 8, 0, 4);
  ctx.fill();

  // Body
  ctx.fillStyle = '#3a2050';
  ctx.beginPath();
  ctx.ellipse(0, 2, 7, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#ff3030';
  ctx.fillRect(-4, -2, 3, 3);
  ctx.fillRect(1, -2, 3, 3);

  ctx.restore();
}

function drawSpider(e, cameraX, t) {
  const sx = e.x - cameraX;
  const sy = e.y;
  if (sx + e.w < 0 || sx > CANVAS_W) return;

  // Thread from ceiling attach point down to spider top
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(sx + e.w / 2, e.ceilingY !== undefined ? e.ceilingY : HUD_H + 5);
  ctx.lineTo(sx + e.w / 2, sy + 4);
  ctx.stroke();

  const cx = sx + e.w / 2;
  const cy = sy + e.h / 2;

  // Legs (4 on each side)
  ctx.strokeStyle = '#5a3010';
  ctx.lineWidth = 1.5;
  const legAngles = [-0.8, -0.3, 0.3, 0.8];
  for (const a of legAngles) {
    const sway = Math.sin(t * 6 + a) * 3;
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy);
    ctx.lineTo(cx - 16, cy + Math.sin(a) * 10 + sway);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 6, cy);
    ctx.lineTo(cx + 16, cy + Math.sin(a) * 10 - sway);
    ctx.stroke();
  }

  // Body
  ctx.fillStyle = '#7a4010';
  ctx.beginPath();
  ctx.ellipse(cx, cy, 7, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = '#9a5020';
  ctx.beginPath();
  ctx.arc(cx, cy - 9, 5, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#ff0';
  ctx.fillRect(cx - 4, cy - 11, 2, 2);
  ctx.fillRect(cx + 2, cy - 11, 2, 2);
}

function drawCoin(item, cameraX, t) {
  const sx = item.x - cameraX + item.w / 2;
  const sy = item.y + item.h / 2;
  if (sx < -16 || sx > CANVAS_W + 16) return;

  const scaleX = Math.abs(Math.cos(t * 3 + item.x * 0.01));
  ctx.save();
  ctx.translate(sx, sy);
  ctx.scale(scaleX, 1);
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.ellipse(0, 0, 7, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffec6e';
  ctx.fillRect(-2, -5, 4, 4);
  ctx.restore();
}

function drawApple(item, cameraX, t) {
  const sx = item.x - cameraX;
  const sy = item.y;
  if (sx + item.w < 0 || sx > CANVAS_W) return;

  const cx = sx + item.w / 2;
  const cy = sy + item.h / 2;

  // Apple body
  ctx.fillStyle = '#e83030';
  ctx.beginPath();
  ctx.arc(cx, cy + 1, 10, 0, Math.PI * 2);
  ctx.fill();

  // Highlight
  ctx.fillStyle = '#ff7070';
  ctx.beginPath();
  ctx.arc(cx - 3, cy - 3, 4, 0, Math.PI * 2);
  ctx.fill();

  // Stem
  ctx.strokeStyle = '#5a3010';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 8);
  ctx.lineTo(cx + 2, cy - 13);
  ctx.stroke();

  // Leaf
  ctx.fillStyle = '#38a830';
  ctx.beginPath();
  ctx.ellipse(cx + 5, cy - 12, 5, 3, -0.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawBanana(item, cameraX, t) {
  const sx = item.x - cameraX;
  const sy = item.y;
  if (sx + item.w < 0 || sx > CANVAS_W) return;

  ctx.strokeStyle = '#f5d020';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(sx + item.w / 2, sy + item.h + 2, 14, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();

  ctx.strokeStyle = '#c8a000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(sx + item.w / 2, sy + item.h + 2, 14, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
}

function drawWeaponPickup(item, cameraX, t) {
  const sx = item.x - cameraX;
  const sy = item.y;
  if (sx + item.w < 0 || sx > CANVAS_W) return;

  const cx = sx + item.w / 2;
  const cy = sy + item.h / 2;
  const pulse = 0.8 + Math.sin(t * 5) * 0.2;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(t * 2);
  ctx.scale(pulse, pulse);

  // Star shape
  ctx.fillStyle = '#00e8e8';
  ctx.beginPath();
  const pts = 5;
  for (let i = 0; i < pts * 2; i++) {
    const r = i % 2 === 0 ? 10 : 5;
    const a = (i / (pts * 2)) * Math.PI * 2 - Math.PI / 2;
    i === 0 ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r)
             : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawProjectile(proj, cameraX) {
  const sx = proj.x - cameraX;
  if (sx < -20 || sx > CANVAS_W + 20) return;

  ctx.fillStyle = '#ff8800';
  ctx.beginPath();
  ctx.arc(sx + proj.w / 2, proj.y + proj.h / 2, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffdd00';
  ctx.beginPath();
  ctx.arc(sx + proj.w / 2, proj.y + proj.h / 2, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawFinish(finish, cameraX) {
  const sx = finish.x - cameraX;
  if (sx + finish.w < -20 || sx > CANVAS_W + 20) return;

  const cx = sx + finish.w / 2;
  const by = finish.y + finish.h;

  // Archway posts
  ctx.fillStyle = '#d4a800';
  ctx.fillRect(sx, finish.y + 20, 12, finish.h - 20);
  ctx.fillRect(sx + finish.w - 12, finish.y + 20, 12, finish.h - 20);

  // Arch
  ctx.strokeStyle = '#d4a800';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, finish.y + 20, finish.w / 2 - 6, Math.PI, 0);
  ctx.stroke();

  // Flag on top
  ctx.fillStyle = '#ff3030';
  ctx.beginPath();
  ctx.moveTo(cx, finish.y - 10);
  ctx.lineTo(cx + 20, finish.y + 5);
  ctx.lineTo(cx, finish.y + 20);
  ctx.closePath();
  ctx.fill();

  // Pole
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, finish.y + 20);
  ctx.lineTo(cx, finish.y - 10);
  ctx.stroke();
}

function drawHazard(h, cameraX, t) {
  const sx = h.x - cameraX;
  if (sx + h.w < 0 || sx > CANVAS_W) return;

  if (h.subtype === 'spike') {
    ctx.fillStyle = '#888';
    const count = Math.floor(h.w / 10);
    for (let i = 0; i < count; i++) {
      ctx.beginPath();
      ctx.moveTo(sx + i * 10, h.y + h.h);
      ctx.lineTo(sx + i * 10 + 5, h.y);
      ctx.lineTo(sx + i * 10 + 10, h.y + h.h);
      ctx.closePath();
      ctx.fill();
    }
  } else if (h.subtype === 'fire') {
    const flicker = Math.sin(t * 15 + h.x * 0.1) * 4;
    ctx.fillStyle = '#ff4400';
    ctx.beginPath();
    ctx.moveTo(sx, h.y + h.h);
    ctx.quadraticCurveTo(sx + h.w * 0.3, h.y + flicker, sx + h.w / 2, h.y - 6 + flicker);
    ctx.quadraticCurveTo(sx + h.w * 0.7, h.y + flicker, sx + h.w, h.y + h.h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffaa00';
    ctx.beginPath();
    ctx.moveTo(sx + h.w * 0.2, h.y + h.h);
    ctx.quadraticCurveTo(sx + h.w * 0.4, h.y + 4 + flicker, sx + h.w / 2, h.y + flicker);
    ctx.quadraticCurveTo(sx + h.w * 0.6, h.y + 4 + flicker, sx + h.w * 0.8, h.y + h.h);
    ctx.closePath();
    ctx.fill();
  }
}

// ── chasing danger ────────────────────────────────────────────────────────────

function drawDanger(dangerX, cameraX) {
  const sx = dangerX - cameraX; // right edge of danger in screen coords
  if (sx <= 0) return;

  const gradW = Math.min(sx + 80, 200);
  const grad = ctx.createLinearGradient(Math.max(0, sx - gradW), 0, sx, 0);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.5, 'rgba(80,0,0,0.5)');
  grad.addColorStop(1, 'rgba(20,0,0,0.95)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, HUD_H, Math.min(sx, CANVAS_W), CANVAS_H - HUD_H);

  // Solid black wall covering everything to the left of dangerX
  if (sx > 0) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, HUD_H, Math.max(0, sx - gradW), CANVAS_H - HUD_H);
  }

  // Fiery edge
  if (sx > 2 && sx < CANVAS_W) {
    ctx.fillStyle = '#ff2200';
    ctx.fillRect(sx - 4, HUD_H, 5, CANVAS_H - HUD_H);
    ctx.fillStyle = '#ff8800';
    ctx.fillRect(sx - 2, HUD_H, 3, CANVAS_H - HUD_H);
  }
}

// ── HUD ───────────────────────────────────────────────────────────────────────

function drawHUD(score, vitality, level, weaponActive, weaponTimer) {
  // Background bar
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, CANVAS_W, HUD_H);
  ctx.fillStyle = '#333';
  ctx.fillRect(0, HUD_H - 2, CANVAS_W, 2);

  // Score
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 16px "Courier New", monospace';
  ctx.fillText(`SCORE ${String(score).padStart(7, '0')}`, 10, 24);

  // Level
  ctx.textAlign = 'right';
  ctx.fillText(`LEVEL ${level + 1}`, CANVAS_W - 10, 24);
  ctx.textAlign = 'left';

  // Vitality bar label
  const barX = 230;
  const barW = 220;
  const barH = 14;
  const barY = 11;

  ctx.fillStyle = '#aaa';
  ctx.font = '11px "Courier New", monospace';
  ctx.fillText('VITALITY', barX, barY + 11);

  const vBarX = barX + 60;
  ctx.fillStyle = '#555';
  ctx.fillRect(vBarX, barY, barW, barH);

  const vPct = vitality / 100;
  const r = Math.round(255 * (1 - vPct));
  const g = Math.round(220 * vPct);
  ctx.fillStyle = `rgb(${r},${g},0)`;
  ctx.fillRect(vBarX, barY, barW * vPct, barH);

  ctx.strokeStyle = '#888';
  ctx.lineWidth = 1;
  ctx.strokeRect(vBarX, barY, barW, barH);

  // Weapon icon
  if (weaponActive) {
    const pulse = 0.7 + Math.sin(performance.now() * 0.005) * 0.3;
    ctx.globalAlpha = pulse;
    ctx.fillStyle = '#00e8e8';
    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.fillText(`★ ${Math.ceil(weaponTimer)}s`, vBarX + barW + 10, barY + 12);
    ctx.globalAlpha = 1;
  }
}

// ── main render entry ─────────────────────────────────────────────────────────

export function render(entities, platforms, t) {
  const { cameraX, score, vitality, level, weaponActive, weaponTimer, dangerX } = state;

  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  drawBackground(cameraX);
  drawGround(platforms, cameraX);

  // Draw items
  for (const e of entities) {
    if (e.dead) continue;
    if (e.type === 'coin')         drawCoin(e, cameraX, t);
    else if (e.type === 'apple')   drawApple(e, cameraX, t);
    else if (e.type === 'banana')  drawBanana(e, cameraX, t);
    else if (e.type === 'weapon')  drawWeaponPickup(e, cameraX, t);
    else if (e.type === 'hazard')  drawHazard(e, cameraX, t);
    else if (e.type === 'finish')  drawFinish(e, cameraX);
  }

  // Draw enemies
  for (const e of entities) {
    if (e.dead) continue;
    if (e.type === 'snail')      drawSnail(e, cameraX, t);
    else if (e.type === 'bat')   drawBat(e, cameraX, t);
    else if (e.type === 'spider') drawSpider(e, cameraX, t);
    else if (e.type === 'projectile') drawProjectile(e, cameraX);
  }

  // Player
  for (const e of entities) {
    if (e.type === 'player') drawPlayer(e, cameraX, t);
  }

  drawDanger(dangerX, cameraX);
  drawHUD(score, vitality, level, weaponActive, weaponTimer);
}
