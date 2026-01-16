// MyGame - Example implementation of Game interface
import { Game, GameFramework } from "./GameFramework.js";
import { Homer } from "./actors/Homer.js";



class MyGame extends Game {
  private homer: Homer = new Homer();


  init(): void {
    console.log("Game started!");
  }

  update(deltaTime: number): void {
    console.log("update:", deltaTime);

    this.homer.move(deltaTime);

  }

  render(ctx: CanvasRenderingContext2D): void {
    // Draw rectangle
    this.homer.render(ctx);

  }
}

const game = new MyGame();
const framework = new GameFramework(game, 600, 600);
framework.start();
console.log("test");
