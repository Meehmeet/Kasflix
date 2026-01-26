export interface Actor {
  id: number;
  getType(): string;
  move(delta: number): void;
  render(ctx: CanvasRenderingContext2D): void;
}
