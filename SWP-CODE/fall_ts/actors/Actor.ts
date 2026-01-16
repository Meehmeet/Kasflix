export interface Actor {
  move(delta: number): void;
  render(ctx: CanvasRenderingContext2D): void;
}
