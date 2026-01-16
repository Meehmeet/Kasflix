export interface Move {
  move(x: number, y: number, time: number, dt: number): { x: number, y: number };
}
