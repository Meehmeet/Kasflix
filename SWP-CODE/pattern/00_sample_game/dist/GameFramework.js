/**
 * Simple 2D Game Framework
 * Provides canvas management, game loop, and basic rendering
 */
/**
 * Game Interface
 * All concrete games must implement these methods
 */
class Game {
}
class GameFramework {
    /**
     * @param {Game} game - A game instance that implements the Game interface
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {string} canvasId - Canvas element ID
     */
    constructor(game, width = 800, height = 600, canvasId = "gameCanvas") {
        this.gameObjects = [];
        this.running = false;
        this.deltaTime = 0;
        this.lastFrameTime = 0;
        if (!(game instanceof Game)) {
            throw new Error("Game must be an instance of Game class");
        }
        this.game = game;
        this.width = width;
        this.height = height;
        // Setup canvas
        const existingCanvas = document.getElementById(canvasId);
        if (existingCanvas) {
            this.canvas = existingCanvas;
        }
        else {
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
    addObject(obj) {
        this.gameObjects.push(obj);
    }
    /**
     * Remove a game object from the scene
     * @param {GameObject} obj - The object to remove
     */
    removeObject(obj) {
        const index = this.gameObjects.indexOf(obj);
        if (index > -1) {
            this.gameObjects.splice(index, 1);
        }
    }
    /**
     * Update all game objects
     */
    updateObjects(deltaTime) {
        for (let obj of this.gameObjects) {
            if (obj.update) {
                obj.update(deltaTime);
            }
        }
    }
    /**
     * Render all game objects
     */
    renderObjects() {
        for (let obj of this.gameObjects) {
            if (obj.render) {
                obj.render(this.ctx);
            }
        }
    }
    /**
     * Clear canvas with background color
     */
    clearCanvas(color = "#ffffff") {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    /**
     * Main game loop
     */
    gameLoop(currentTime) {
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
    start() {
        if (this.running)
            return;
        this.running = true;
        this.game.init();
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    /**
     * Stop the game
     */
    stop() {
        this.running = false;
    }
    /**
     * Draw a rectangle
     */
    drawRect(x, y, width, height, color = "#000000") {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }
    /**
     * Draw a circle
     */
    drawCircle(x, y, radius, color = "#000000") {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
    /**
     * Draw text
     */
    drawText(text, x, y, color = "#000000", fontSize = 16) {
        this.ctx.fillStyle = color;
        this.ctx.font = `${fontSize}px Arial`;
        this.ctx.fillText(text, x, y);
    }
}
export { Game, GameFramework };
