import { GRAVITY, JUMP_FORCE, CANVAS_H } from './config.js';
import { state } from './gameState.js';
import { isDown } from './input.js';

const MAX_FALL = 900;
const JUMP_HOLD_FRAMES = 10; // frames player can hold jump for extra height

export function applyGravity(entity, dt) {
  entity.vy = Math.min(entity.vy + GRAVITY * dt, MAX_FALL);
}

export function moveEntity(entity, dt) {
  entity.x += entity.vx * dt;
  entity.y += entity.vy * dt;
}

export function handleJump(player) {
  if (isDown('jump')) {
    if (player.onGround) {
      // Initial jump
      player.vy = JUMP_FORCE;
      player.onGround = false;
      player.jumpHeld = true;
      player.jumpFrames = 0;
    } else if (player.jumpHeld && player.jumpFrames < JUMP_HOLD_FRAMES) {
      // Hold jump for extra height
      player.vy += JUMP_FORCE * 0.06;
      player.jumpFrames++;
    }
  } else {
    player.jumpHeld = false;
    player.jumpFrames = JUMP_HOLD_FRAMES; // prevent re-trigger
  }
}

export function resolvePlatformCollisions(entity, platforms) {
  entity.onGround = false;

  for (const p of platforms) {
    if (!aabbOverlap(entity, p)) continue;

    const midY = entity.y + entity.h / 2;
    const platMidY = p.y + p.h / 2;

    if (entity.vy >= 0 && midY < p.y + p.h * 0.6) {
      // Falling and entity center is above 60% of platform — land on top
      entity.y = p.y - entity.h;
      entity.vy = 0;
      entity.onGround = true;
    } else if (entity.vy < 0 && midY > platMidY) {
      // Rising and entity center is below platform center — hit underside
      entity.y = p.y + p.h;
      entity.vy = 0;
    } else {
      // Horizontal collision — push entity out based on movement direction
      if (entity.vx >= 0) entity.x = p.x - entity.w;
      else entity.x = p.x + p.w;
      entity.vx = 0;
    }
  }
}

function aabbOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}

export function updateCamera(player, levelWidth) {
  // Camera leads ahead of player slightly; never scrolls back
  const target = player.x - 200;
  if (target > state.cameraX) state.cameraX = target;
  // Don't scroll past level end
  state.cameraX = Math.min(state.cameraX, levelWidth - 800);
  state.cameraX = Math.max(0, state.cameraX);
}

export function advanceDanger(dt, dangerSpeed) {
  state.dangerX += dangerSpeed * dt;
}

export function isInPit(entity) {
  return entity.y > CANVAS_H + 60;
}
