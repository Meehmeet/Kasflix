export abstract class Game {
  abstract init(): void;
  abstract update(deltaTime: number): void;
  abstract render(ctx: CanvasRenderingContext2D): void;
}

export class GameFramework {
  private game: Game;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lastTime = 0;
  private running = false;

  constructor(game: Game, width = 800, height = 600) {
    this.game = game;
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.border = "1px solid black";
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d")!;
  }

  start() {
    this.game.init();
    this.running = true;
    requestAnimationFrame(this.loop);
  }

  private loop = (time: number) => {
    if (!this.running) return;
    const dt = (time - this.lastTime) / 1000;
    this.lastTime = time;

    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.game.update(dt);
    this.game.render(this.ctx);

    requestAnimationFrame(this.loop);
  };
}
