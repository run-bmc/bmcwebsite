import { createPill, type Pill } from "@/game/entities/pill";
import { createTarget, type Target } from "@/game/entities/target";
import type { WorldState } from "@/game/state";

export function calculateSpawnInterval(elapsed: number) {
  return Math.max(0.32, 0.92 - elapsed * 0.02);
}

const INVADER_PATTERNS = [
  [
    [0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 0, 1, 1, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [0, 1, 0, 0, 0, 0, 1, 0],
  ],
  [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 1],
  ],
  [
    [0, 1, 1, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 0, 1, 1, 0, 1, 0],
    [1, 0, 1, 0, 0, 1, 0, 1],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 1],
  ],
];

const INVADER_COLORS = [
  "#69d2a0",
  "#ff9f68",
  "#d37df7",
  "#72a6ff",
  "#f1d26b",
  "#ff6d8f",
];

export function spawnTarget(world: WorldState): Target {
  const size = 18 + Math.floor(Math.random() * 3) * 6;
  const x = Math.random() * (world.width - size);
  const ramp = Math.min(world.elapsed * 7.2, 250);
  const speed = 52 + ramp + Math.random() * 28;
  const color = INVADER_COLORS[Math.floor(Math.random() * INVADER_COLORS.length)];
  const pattern = INVADER_PATTERNS[Math.floor(Math.random() * INVADER_PATTERNS.length)];

  return createTarget(x, size, speed, color, pattern);
}

export function calculatePillInterval(elapsed: number) {
  return Math.max(5.6, 10.5 - elapsed * 0.08);
}

export function spawnPill(world: WorldState): Pill {
  const x = 28 + Math.random() * (world.width - 56);
  return createPill(x);
}
