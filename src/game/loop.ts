import { intersects } from "@/game/collision";
import type { InputState } from "@/game/input";
import { calculatePillInterval, calculateSpawnInterval, spawnPill, spawnTarget } from "@/game/spawn";
import { createExhaustBurst, createPlayerVolley, type WorldState } from "@/game/state";

const MAX_DT = 1 / 30;
const FIRE_INTERVAL = 0.16;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function stepWorld(world: WorldState, input: InputState, dt: number) {
  const frame = Math.min(dt, MAX_DT);

  updateStars(world, frame);

  if (world.phase !== "playing") {
    return;
  }

  world.elapsed += frame;

  const horizontal = Number(input.right) - Number(input.left);
  world.player.x = clamp(
    world.player.x + horizontal * world.player.speed * frame,
    16,
    world.width - world.player.width - 16,
  );

  world.exhaust.push(...createExhaustBurst(world.player, horizontal * world.player.speed));
  world.exhaust = world.exhaust
    .map((particle) => ({
      ...particle,
      x: particle.x + particle.vx * frame,
      y: particle.y + particle.vy * frame,
      life: particle.life - frame,
    }))
    .filter((particle) => particle.life > 0);

  world.fireTimer += frame;
  if (input.shoot && world.fireTimer >= FIRE_INTERVAL) {
    world.bullets.push(...createPlayerVolley(world.player, world.gunLevel));
    world.fireTimer = 0;
  }

  world.spawnTimer += frame;
  const spawnInterval = calculateSpawnInterval(world.elapsed);
  if (world.spawnTimer >= spawnInterval) {
    world.targets.push(spawnTarget(world));
    world.spawnTimer = 0;
  }

  world.pillTimer += frame;
  const pillInterval = calculatePillInterval(world.elapsed);
  if (world.pillTimer >= pillInterval) {
    world.pills.push(spawnPill(world));
    world.pillTimer = 0;
  }

  world.bullets = world.bullets
    .map((bullet) => ({
      ...bullet,
      x: bullet.x + bullet.vx * frame,
      y: bullet.y - bullet.speed * frame,
    }))
    .filter(
      (bullet) =>
        bullet.y + bullet.height > 0 &&
        bullet.x + bullet.width > 0 &&
        bullet.x < world.width,
    );

  world.targets = world.targets
    .map((target) => ({
      ...target,
      y: target.y + target.speed * frame,
    }))
    .filter((target) => target.y < world.height + target.height);

  world.pills = world.pills
    .map((pill) => ({
      ...pill,
      y: pill.y + pill.speed * frame,
    }))
    .filter((pill) => pill.y < world.height + pill.height);

  const hitBullets = new Set<number>();
  const hitTargets = new Set<number>();
  const hitPills = new Set<number>();

  world.bullets.forEach((bullet, bulletIndex) => {
    world.targets.forEach((target, targetIndex) => {
      if (hitBullets.has(bulletIndex) || hitTargets.has(targetIndex)) {
        return;
      }

      if (intersects(bullet, target)) {
        hitBullets.add(bulletIndex);
        hitTargets.add(targetIndex);
        world.score += 1;
      }
    });

    world.pills.forEach((pill, pillIndex) => {
      if (hitBullets.has(bulletIndex) || hitPills.has(pillIndex)) {
        return;
      }

      if (intersects(bullet, pill)) {
        hitBullets.add(bulletIndex);
        hitPills.add(pillIndex);
      }
    });
  });

  if (hitBullets.size > 0 || hitPills.size > 0) {
    world.bullets = world.bullets.filter((_, index) => !hitBullets.has(index));
    world.targets = world.targets.filter((_, index) => !hitTargets.has(index));
    world.pills = world.pills.filter((_, index) => !hitPills.has(index));
  }

  const collectedPills = new Set<number>();
  world.pills.forEach((pill, index) => {
    if (intersects(pill, world.player)) {
      collectedPills.add(index);
      if (world.gunLevel < 4) {
        world.gunLevel += 1;
      } else {
        world.overflowPills += 1;
        world.score += world.overflowPills * 50;
      }
    }
  });

  if (collectedPills.size > 0) {
    world.pills = world.pills.filter((_, index) => !collectedPills.has(index));
  }

  const playerHit = world.targets.some((target) =>
    intersects(target, world.player),
  );

  if (playerHit) {
    world.phase = "gameOver";
  }
}

function updateStars(world: WorldState, dt: number) {
  world.stars = world.stars.map((star) => {
    const nextY = star.y + star.speed * dt;

    return {
      ...star,
      y: nextY > world.height ? -star.size : nextY,
      x: nextY > world.height ? Math.random() * world.width : star.x,
    };
  });
}
