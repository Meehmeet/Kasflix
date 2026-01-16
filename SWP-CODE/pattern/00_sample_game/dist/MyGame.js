// MyGame - Example implementation of Game interface
import { Game, GameFramework } from "./GameFramework.js";
import { Homer } from "./actors/Homer.js";
class MyGame extends Game {
    constructor() {
        super(...arguments);
        this.homer = new Homer();
    }
    init() {
        console.log("Game started!");
    }
    update(deltaTime) {
        console.log("update:", deltaTime);
        this.homer.move(deltaTime);
    }
    render(ctx) {
        // Draw rectangle
        this.homer.render(ctx);
    }
}
const game = new MyGame();
const framework = new GameFramework(game, 600, 600);
framework.start();
console.log("test");
