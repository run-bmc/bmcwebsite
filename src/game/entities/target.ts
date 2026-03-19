export type Target = {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
  pattern: number[][];
};

export function createTarget(
  x: number,
  size: number,
  speed: number,
  color: string,
  pattern: number[][],
): Target {
  return {
    x,
    y: -size,
    width: size,
    height: size,
    speed,
    color,
    pattern,
  };
}
