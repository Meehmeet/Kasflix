import { Actor } from "./Actor";

export class Homer implements Actor {
  private x: number = 100;

  move(delta: number): void {
    this.x++;
    if (this.x > 600) {
      this.x = 0;
    }
    console.log("x:", this.x);
  }
  render(ctx: CanvasRenderingContext2D): void {
    console.log("rendering");
    ctx.fillStyle = '#FF0000'; // Farbe (rot)
    ctx.fillRect(this.x, 50, 50, 50);
  }
}
