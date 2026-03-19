import type { WorldState } from "@/game/state";

function drawStars(ctx: CanvasRenderingContext2D, world: WorldState) {
  world.stars.forEach((star) => {
    ctx.fillStyle = `rgba(205, 220, 255, ${star.alpha})`;
    ctx.fillRect(star.x, star.y, star.size, star.size);
  });
}

function drawPlayer(ctx: CanvasRenderingContext2D, world: WorldState) {
  const { player } = world;

  ctx.fillStyle = "#24573b";
  ctx.fillRect(player.x + 12, player.y, 6, 6);
  ctx.fillRect(player.x + 8, player.y + 6, 14, 8);
  ctx.fillRect(player.x + 4, player.y + 14, 22, 10);
  ctx.fillRect(player.x + 1, player.y + 24, 8, 4);
  ctx.fillRect(player.x + 21, player.y + 24, 8, 4);
  ctx.fillStyle = "#d8b456";
  ctx.fillRect(player.x + 11, player.y + 7, 8, 7);
  ctx.fillStyle = "#183828";
  ctx.fillRect(player.x + 7, player.y + 18, 16, 4);
}

function drawExhaust(ctx: CanvasRenderingContext2D, world: WorldState) {
  world.exhaust.forEach((particle) => {
    const alpha = particle.life / particle.maxLife;
    ctx.fillStyle = `rgba(255, 196, 92, ${alpha * 0.72})`;
    ctx.fillRect(particle.x, particle.y, particle.size, particle.size + 1);
    ctx.fillStyle = `rgba(238, 96, 54, ${alpha * 0.56})`;
    ctx.fillRect(
      particle.x + 1,
      particle.y + 1,
      Math.max(1, particle.size - 2),
      Math.max(2, particle.size),
    );
  });
}

function drawBullets(ctx: CanvasRenderingContext2D, world: WorldState) {
  ctx.fillStyle = "#f8f3d6";
  world.bullets.forEach((bullet) => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

function drawTargets(ctx: CanvasRenderingContext2D, world: WorldState) {
  world.targets.forEach((target) => {
    const cell = Math.max(2, Math.floor(target.width / 8));
    const spriteWidth = cell * 8;
    const offsetX = target.x + Math.floor((target.width - spriteWidth) / 2);

    target.pattern.forEach((row, rowIndex) => {
      row.forEach((filled, columnIndex) => {
        if (!filled) {
          return;
        }

        ctx.fillStyle = target.color;
        ctx.fillRect(
          offsetX + columnIndex * cell,
          target.y + rowIndex * cell,
          cell,
          cell,
        );
      });
    });
  });
}

function drawPills(ctx: CanvasRenderingContext2D, world: WorldState) {
  world.pills.forEach((pill) => {
    const blink = 0.58 + Math.sin(timestampNow() / 140 + pill.blinkOffset) * 0.42;
    ctx.fillStyle = `rgba(243, 208, 98, ${0.45 + blink * 0.4})`;
    ctx.fillRect(pill.x - 1, pill.y - 1, pill.width + 2, pill.height + 2);
    ctx.fillStyle = "#f3d062";
    ctx.fillRect(pill.x, pill.y, pill.width, Math.floor(pill.height / 2));
    ctx.fillStyle = "#8a46da";
    ctx.fillRect(
      pill.x,
      pill.y + Math.floor(pill.height / 2),
      pill.width,
      Math.ceil(pill.height / 2),
    );
    ctx.fillStyle = "#161827";
    ctx.fillRect(pill.x + 2, pill.y + 10, pill.width - 4, 2);
    ctx.fillRect(pill.x + 4, pill.y + 4, 2, 2);
    ctx.fillRect(pill.x + pill.width - 6, pill.y + pill.height - 6, 2, 2);
  });
}

function timestampNow() {
  return typeof performance === "undefined" ? 0 : performance.now();
}

export function renderWorld(
  ctx: CanvasRenderingContext2D,
  world: WorldState,
  timestamp: number,
) {
  const shimmer = 0.08 + Math.sin(timestamp / 900) * 0.03;

  ctx.clearRect(0, 0, world.width, world.height);
  ctx.fillStyle = "#060816";
  ctx.fillRect(0, 0, world.width, world.height);

  ctx.fillStyle = `rgba(116, 143, 255, ${shimmer})`;
  ctx.fillRect(24, 0, 1, world.height);
  ctx.fillRect(world.width - 25, 0, 1, world.height);

  drawStars(ctx, world);
  drawExhaust(ctx, world);
  drawBullets(ctx, world);
  drawPills(ctx, world);
  drawTargets(ctx, world);
  drawPlayer(ctx, world);
}
