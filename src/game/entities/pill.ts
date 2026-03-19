export type Pill = {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  blinkOffset: number;
};

export function createPill(x: number): Pill {
  return {
    x,
    y: -24,
    width: 16,
    height: 22,
    speed: 92,
    blinkOffset: Math.random() * Math.PI * 2,
  };
}
