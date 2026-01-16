import { Actor } from "./Actor";

export class MyRectangle implements Actor {
  private x: number = 100;
  private y: number = 50;
  private color: string = '#FF0000';
  private width: number;
  private height: number;


  constructor(x: number = 100, y: number = 40, color: string = '#FF0000', width: number = 10, height: number = 10) {
    this.x = x;
    this.y = this.y;
    this.color = color;
    this.width = width;
    this.height = height;
  }

  move(delta: number): void {
    this.x++;
    if (this.x > 600) {
      this.x = 0;
    }
    console.log("x:", this.x);
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    console.log("rendering");
    ctx.fillStyle = this.color; // Farbe (rot)
    //
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
