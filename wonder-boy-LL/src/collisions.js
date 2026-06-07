import {
  VITALITY_ENEMY_HIT, VITALITY_HAZARD_HIT,
  VITALITY_APPLE, VITALITY_BANANA,
  WEAPON_DURATION,
  SCORE_COIN, SCORE_APPLE, SCORE_BANANA, SCORE_ENEMY,
} from './config.js';
import { state } from './gameState.js';
import { addScore, addVitality } from './scoring.js';

function aabb(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}

// Returns 'top' if player is landing on enemy from above, 'side' otherwise.
function collisionSide(player, enemy) {
  const playerBottom = player.y + player.h;
  const playerPrevBottom = playerBottom - player.vy * 0.016;
  if (player.vy > 0 && playerPrevBottom <= enemy.y + 8) return 'top';
  return 'side';
}

const DAMAGE_COOLDOWN = 1.2; // seconds of invincibility after taking damage

export function checkCollisions(player, entities) {
  // damageCooldown is ticked in updatePlayer; just read it here

  for (const e of entities) {
    if (e.dead || e.type === 'player' || e.type === 'projectile') continue;

    if (!aabb(player, e)) continue;

    switch (e.type) {
      case 'snail':
      case 'spider': {
        const side = collisionSide(player, e);
        if (side === 'top') {
          // Stomp — defeat enemy
          e.dead = true;
          addScore(SCORE_ENEMY);
          player.vy = -320; // bounce
        } else if (player.damageCooldown <= 0) {
          // Side hit — take damage
          addVitality(-VITALITY_ENEMY_HIT);
          player.damageCooldown = DAMAGE_COOLDOWN;
        }
        break;
      }

      case 'bat': {
        // Bats cannot be stomped
        if (player.damageCooldown <= 0) {
          addVitality(-VITALITY_ENEMY_HIT);
          player.damageCooldown = DAMAGE_COOLDOWN;
        }
        break;
      }

      case 'coin': {
        e.dead = true;
        addScore(SCORE_COIN);
        break;
      }

      case 'apple': {
        e.dead = true;
        addScore(SCORE_APPLE);
        addVitality(VITALITY_APPLE);
        break;
      }

      case 'banana': {
        e.dead = true;
        addScore(SCORE_BANANA);
        addVitality(VITALITY_BANANA);
        break;
      }

      case 'weapon': {
        e.dead = true;
        state.weaponActive = true;
        state.weaponTimer = WEAPON_DURATION;
        break;
      }

      case 'hazard': {
        if (player.damageCooldown <= 0) {
          addVitality(-VITALITY_HAZARD_HIT);
          player.damageCooldown = DAMAGE_COOLDOWN;
        }
        break;
      }

      case 'finish': {
        return 'finish';
      }
    }
  }

  return null;
}

export function checkProjectileCollisions(entities) {
  const projectiles = entities.filter(e => e.type === 'projectile' && !e.dead);
  const enemies = entities.filter(e =>
    !e.dead && (e.type === 'snail' || e.type === 'bat' || e.type === 'spider')
  );

  for (const proj of projectiles) {
    for (const enemy of enemies) {
      if (enemy.dead) continue;
      if (aabb(proj, enemy)) {
        proj.dead = true;
        enemy.dead = true;
        addScore(SCORE_ENEMY);
        break;
      }
    }
  }
}

export function checkDangerCaught(player) {
  // Danger's right edge is state.dangerX; danger catches player if it overlaps them
  return state.dangerX >= player.x + player.w * 0.4;
}
