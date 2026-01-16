import { Actor } from "./Actor.js";
import { Move } from "../interfaces/Move.js";

export class Rect implements Actor {
  x: number;
  y: number;
  speed: number;
  time: number = 0;
  private startX: number;
  private movement: Move;
  private movement2: Move;
  private movement3: Move;
  private currentMovement: Move;

  constructor(startX: number, movement1: Move, movement2: Move, movement3: Move) {
    this.startX = startX;
    this.x = startX;
    this.y = Math.random() * -300;
    this.speed = Math.random() * 50 + 50;
    this.movement = movement1;
    this.movement2 = movement2;
    this.movement3 = movement3;
    this.currentMovement = movement1;
  }

  move(dt: number): void {
    this.time += dt;
    this.y += this.speed * dt;
    
    // Wechsle Movement bei y > 300
    if (this.y > 300 && this.currentMovement === this.movement) {
      this.currentMovement = Math.random() > 0.5 ? this.movement2 : this.movement3;
    }
    
    const pos = this.currentMovement.move(this.x, this.y, this.time, dt);
    this.x = pos.x;
    
    if (this.y > 650) {
      this.y = Math.random() * -300;
      this.x = this.startX;
      this.time = 0;
      this.currentMovement = this.movement;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x - 20, this.y - 20, 40, 40);
  }
}
