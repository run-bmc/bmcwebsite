import { createBullet, type Bullet } from "@/game/entities/bullet";
import type { Pill } from "@/game/entities/pill";
import { createPlayer, type Player } from "@/game/entities/player";
import type { Target } from "@/game/entities/target";

export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 720;

export type GamePhase = "idle" | "playing" | "gameOver" | "mobilePreview";

export type Star = {
  x: number;
  y: number;
  size: number;
  speed: number;
  alpha: number;
};

export type ExhaustParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
};

export type WorldState = {
  phase: GamePhase;
  width: number;
  height: number;
  player: Player;
  bullets: Bullet[];
  targets: Target[];
  pills: Pill[];
  stars: Star[];
  exhaust: ExhaustParticle[];
  score: number;
  gunLevel: number;
  overflowPills: number;
  elapsed: number;
  spawnTimer: number;
  pillTimer: number;
  fireTimer: number;
};

export function createStars(count: number, width: number, height: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() > 0.8 ? 2 : 1,
    speed: 8 + Math.random() * 28,
    alpha: 0.24 + Math.random() * 0.46,
  }));
}

export function createWorld(phase: GamePhase = "idle"): WorldState {
  return {
    phase,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    player: createPlayer(GAME_WIDTH, GAME_HEIGHT),
    bullets: [],
    targets: [],
    pills: [],
    stars: createStars(64, GAME_WIDTH, GAME_HEIGHT),
    exhaust: [],
    score: 0,
    gunLevel: 0,
    overflowPills: 0,
    elapsed: 0,
    spawnTimer: 0,
    pillTimer: 0,
    fireTimer: 0,
  };
}

export function startWorld(previous?: WorldState): WorldState {
  const next = createWorld("playing");

  if (previous) {
    next.stars = previous.stars.map((star) => ({ ...star }));
  }

  return next;
}

type VolleyPattern = {
  offsetX: number;
  vx: number;
};

const VOLLEYS: VolleyPattern[][] = [
  [{ offsetX: 0, vx: 0 }],
  [
    { offsetX: -6, vx: 0 },
    { offsetX: 6, vx: 0 },
  ],
  [
    { offsetX: -10, vx: 0 },
    { offsetX: 0, vx: 0 },
    { offsetX: 10, vx: 0 },
  ],
  [
    { offsetX: -10, vx: -95 },
    { offsetX: 0, vx: 0 },
    { offsetX: 10, vx: 95 },
  ],
  [
    { offsetX: -12, vx: -150 },
    { offsetX: -6, vx: -78 },
    { offsetX: 0, vx: 0 },
    { offsetX: 6, vx: 78 },
    { offsetX: 12, vx: 150 },
  ],
];

export function createPlayerVolley(player: Player, gunLevel: number): Bullet[] {
  const pattern = VOLLEYS[Math.min(gunLevel, VOLLEYS.length - 1)];
  const originX = player.x + player.width / 2 - 2;
  const originY = player.y - 8;

  return pattern.map(({ offsetX, vx }) =>
    createBullet(originX + offsetX, originY, vx),
  );
}

export function createExhaustBurst(player: Player, drift: number): ExhaustParticle[] {
  const y = player.y + player.height - 4;

  return [player.x + 9, player.x + player.width - 13].map((x, index) => {
    const maxLife = 0.34 + Math.random() * 0.12;

    return {
      x,
      y,
      vx: drift * -0.16 + (index === 0 ? -12 : 12),
      vy: 68 + Math.random() * 22,
      life: maxLife,
      maxLife,
      size: 4 + Math.random() * 2,
    };
  });
}
