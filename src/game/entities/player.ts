export type Player = {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
};

export function createPlayer(gameWidth: number, gameHeight: number): Player {
  return {
    x: gameWidth / 2 - 15,
    y: gameHeight - 88,
    width: 30,
    height: 30,
    speed: 280,
  };
}
