import { Game, GameFramework } from "./GameFramework.js";
import { Actor } from "./actors/Actor.js";
import { Circle } from "./actors/Circle.js";
import { Rect } from "./actors/Rect.js";
import { Triangle } from "./actors/Triangle.js";
import { Gerade } from "./interfaces/Gerade.js";
import { Sinus } from "./interfaces/Sinus.js";
import { ZickZack } from "./interfaces/ZickZack.js";

class MyGame extends Game {
  private shapes: Actor[] = [];

  init(): void {
    console.log("Falling Objects Game Started");
    
    // Je 5 Circles, Rects und Triangles erstellen
    for (let i = 0; i < 5; i++) {
      const startX = Math.random() * 760 + 20;
      const move1 = new Gerade(startX);
      const move2 = new Sinus(startX);
      const move3 = new ZickZack(startX);
      
      this.shapes.push(new Circle(startX, move1, move2, move3));
    }
    
    for (let i = 0; i < 5; i++) {
      const startX = Math.random() * 760 + 20;
      const move1 = new Gerade(startX);
      const move2 = new Sinus(startX);
      const move3 = new ZickZack(startX);
      
      this.shapes.push(new Rect(startX, move1, move2, move3));
    }
    
    for (let i = 0; i < 5; i++) {
      const startX = Math.random() * 760 + 20;
      const move1 = new Gerade(startX);
      const move2 = new Sinus(startX);
      const move3 = new ZickZack(startX);
      
      this.shapes.push(new Triangle(startX, move1, move2, move3));
    }
  }

  update(dt: number): void {
    for (const shape of this.shapes) {
      shape.move(dt);
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (const shape of this.shapes) {
      shape.render(ctx);
    }
  }
}

const game = new MyGame();
const framework = new GameFramework(game, 800, 600);
framework.start();
