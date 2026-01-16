import { Move } from "../interfaces/Move.js";

export class Gerade implements Move {
  private startX: number;

  constructor(startX: number) {
    this.startX = startX;
  }

  move(x: number, y: number, time: number, dt: number): { x: number, y: number } {
    return { x: this.startX, y };
  }
}
