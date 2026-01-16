import { Move } from "../interfaces/Move.js";

export class Sinus implements Move {
  private startX: number;

  constructor(startX: number) {
    this.startX = startX;
  }

  move(x: number, y: number, time: number, dt: number): { x: number, y: number } {
    return { 
      x: this.startX + Math.sin(time * 2) * 80, 
      y 
    };
  }
}
