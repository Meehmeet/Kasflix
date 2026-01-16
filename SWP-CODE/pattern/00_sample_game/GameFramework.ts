/**
 * Simple 2D Game Framework
 * Provides canvas management, game loop, and basic rendering
 */

/**
 * GameObject Interface
 */
interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  update?: (deltaTime: number) => void;
  render?: (ctx: CanvasRenderingContext2D) => void;
}

/**
 * Game Interface
 * All concrete games must implement these methods
 */
abstract class Game {
  /**
   * Initialize the game
   * @abstract
   */
  abstract init(): void;

  /**
   * Update game state every frame
   * @abstract
   * @param {number} deltaTime - Time since last frame in seconds
   */
  abstract update(deltaTime: number): void;

  /**
   * Render game to canvas
   * @abstract
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  abstract render(ctx: CanvasRenderingContext2D): void;
}

class GameFramework {
  private game: Game;
  private width: number;
  private height: number;
  private gameObjects: GameObject[] = [];
  private running: boolean = false;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private deltaTime: number = 0;
  private lastFrameTime: number = 0;

  /**
   * @param {Game} game - A game instance that implements the Game interface
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   * @param {string} canvasId - Canvas element ID
   */
  constructor(
    game: Game,
    width: number = 800,
    height: number = 600,
    canvasId: string = "gameCanvas"
  ) {
    if (!(game instanceof Game)) {
      throw new Error("Game must be an instance of Game class");
    }

    this.game = game;
    this.width = width;
    this.height = height;

    // Setup canvas
    const existingCanvas = document.getElementById(
      canvasId
    ) as HTMLCanvasElement | null;
    if (existingCanvas) {
      this.canvas = existingCanvas;
    } else {
      this.canvas = document.createElement("canvas");
      this.canvas.id = canvasId;
      document.body.appendChild(this.canvas);
    }
    this.canvas.width = width;
    this.canvas.height = height;

    const context = this.canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not get 2D context from canvas");
    }
    this.ctx = context;
  }

  /**
   * Add a game object to the scene
   * @param {GameObject} obj - Object with x, y, width, height, and optional update/render methods
   */
  addObject(obj: GameObject): void {
    this.gameObjects.push(obj);
  }

  /**
   * Remove a game object from the scene
   * @param {GameObject} obj - The object to remove
   */
  removeObject(obj: GameObject): void {
    const index = this.gameObjects.indexOf(obj);
    if (index > -1) {
      this.gameObjects.splice(index, 1);
    }
  }

  /**
   * Update all game objects
   */
  private updateObjects(deltaTime: number): void {
    for (let obj of this.gameObjects) {
      if (obj.update) {
        obj.update(deltaTime);
      }
    }
  }

  /**
   * Render all game objects
   */
  private renderObjects(): void {
    for (let obj of this.gameObjects) {
      if (obj.render) {
        obj.render(this.ctx);
      }
    }
  }

  /**
   * Clear canvas with background color
   */
  clearCanvas(color: string = "#ffffff"): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  /**
   * Main game loop
   */
  private gameLoop(currentTime: number): void {
    if (this.lastFrameTime === 0) {
      this.lastFrameTime = currentTime;
    }

    this.deltaTime = (currentTime - this.lastFrameTime) / 1000; // Convert to seconds
    this.lastFrameTime = currentTime;

    // Update game and all objects
    this.game.update(this.deltaTime);
    this.updateObjects(this.deltaTime);

    // Clear and render
    this.clearCanvas();
    this.renderObjects();
    this.game.render(this.ctx);

    // Continue loop
    if (this.running) {
      requestAnimationFrame((time) => this.gameLoop(time));
    }
  }

  /**
   * Start the game
   */
  start(): void {
    if (this.running) return;
    this.running = true;
    this.game.init();
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  /**
   * Stop the game
   */
  stop(): void {
    this.running = false;
  }

  /**
   * Draw a rectangle
   */
  drawRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string = "#000000"
  ): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  }

  /**
   * Draw a circle
   */
  drawCircle(
    x: number,
    y: number,
    radius: number,
    color: string = "#000000"
  ): void {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
   * Draw text
   */
  drawText(
    text: string,
    x: number,
    y: number,
    color: string = "#000000",
    fontSize: number = 16
  ): void {
    this.ctx.fillStyle = color;
    this.ctx.font = `${fontSize}px Arial`;
    this.ctx.fillText(text, x, y);
  }
}

export { Game, GameFramework };
export type { GameObject };
