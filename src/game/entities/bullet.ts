export type Bullet = {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  vx: number;
};

export function createBullet(x: number, y: number, vx = 0): Bullet {
  return {
    x,
    y,
    width: 4,
    height: 10,
    speed: 520,
    vx,
  };
}
