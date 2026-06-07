import { PLAYER_W, PLAYER_H, WALK_SPEED, PROJECTILE_SPEED } from './config.js';
import { state } from './gameState.js';
import { isDown, consumeKey } from './input.js';

// ── Player ────────────────────────────────────────────────────────────────────

export function createPlayer(startX, startY) {
  return {
    type: 'player',
    x: startX,
    y: startY,
    w: PLAYER_W,
    h: PLAYER_H,
    vx: 0,
    vy: 0,
    onGround: false,
    facingLeft: false,
    attacking: false,
    attackCooldown: 0,
    damageCooldown: 0,  // invincibility frames after taking damage
    dead: false,
    jumpHeld: false,
    jumpFrames: 0,
  };
}

export function updatePlayer(player, dt, platforms, entities, levelWidth) {
  if (player.damageCooldown > 0) player.damageCooldown -= dt;
  // Horizontal movement
  if (isDown('right')) {
    player.vx = WALK_SPEED;
    player.facingLeft = false;
  } else if (isDown('left')) {
    player.vx = -WALK_SPEED;
    player.facingLeft = true;
  } else {
    player.vx = 0;
  }

  // Clamp to camera left and level right
  const minX = state.cameraX;
  const maxX = levelWidth - player.w;
  player.x = Math.max(minX, Math.min(maxX, player.x));

  // Attack
  player.attackCooldown -= dt;
  player.attacking = false;
  if (state.weaponActive && consumeKey('attack') && player.attackCooldown <= 0) {
    player.attacking = true;
    player.attackCooldown = 0.35;
    spawnProjectile(player, entities);
  }

  // Weapon timer
  if (state.weaponActive) {
    state.weaponTimer -= dt;
    if (state.weaponTimer <= 0) {
      state.weaponActive = false;
      state.weaponTimer = 0;
    }
  }
}

function spawnProjectile(player, entities) {
  entities.push({
    type: 'projectile',
    x: player.facingLeft ? player.x - 14 : player.x + player.w,
    y: player.y + player.h * 0.3,
    w: 12,
    h: 12,
    vx: player.facingLeft ? -PROJECTILE_SPEED : PROJECTILE_SPEED,
    vy: 0,
    dead: false,
  });
}

// ── Enemies ───────────────────────────────────────────────────────────────────

export function updateSnail(e, dt, platforms) {
  // Snails patrol back and forth on their platform
  e.x += e.vx * dt;

  // Turn around at platform edges or when hitting a wall
  let onPlatform = false;
  for (const p of platforms) {
    if (
      e.x + e.w > p.x && e.x < p.x + p.w &&
      Math.abs((e.y + e.h) - p.y) < 4
    ) {
      onPlatform = true;
      if (e.x <= p.x + 2)      { e.vx = Math.abs(e.vx); e.facingLeft = false; }
      if (e.x + e.w >= p.x + p.w - 2) { e.vx = -Math.abs(e.vx); e.facingLeft = true; }
      break;
    }
  }
  if (!onPlatform) e.vx *= -1;
}

export function updateBat(e, dt, t) {
  // Bats patrol within 300px of their spawn position
  if (e.spawnX === undefined) e.spawnX = e.x;
  e.x += e.vx * dt;
  if (e.x < e.spawnX - 300) { e.vx = Math.abs(e.vx); e.facingLeft = false; }
  if (e.x > e.spawnX + 80)  { e.vx = -Math.abs(e.vx); e.facingLeft = true; }
  e.y = e.sineBase + Math.sin(t * e.sineSpeed) * e.sineAmp;
}

export function updateSpider(e, dt) {
  e.y += e.dropDir * e.speed * dt;
  const maxY = (e.ceilingY || 0) + e.dropRange;
  const minY = (e.ceilingY || 0) + 20;
  if (e.y >= maxY) e.dropDir = -1;
  if (e.y <= minY) e.dropDir = 1;
  e.threadY = e.ceilingY || 0;
}

export function updateProjectiles(entities, dt, levelWidth) {
  for (const e of entities) {
    if (e.type !== 'projectile' || e.dead) continue;
    e.x += e.vx * dt;
    if (e.x < 0 || e.x > levelWidth) e.dead = true;
  }
}

export function updateMovingPlatforms(platforms, dt) {
  for (const p of platforms) {
    if (!p.moving) continue;
    p.x += p.moveDir * p.moveSpeed * dt;
    p.moveBase = p.moveBase ?? p.x;
    if (Math.abs(p.x - p.moveBase) >= p.moveRange) {
      p.moveDir *= -1;
    }
  }
}
