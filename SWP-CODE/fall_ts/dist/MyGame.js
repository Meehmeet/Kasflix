import { Game, GameFramework } from "./GameFramework.js";
import { ActorFactory } from "./patterns/ActorFactory.js";
import { GameStats } from "./patterns/GameStats.js";
import { DeathNotifier } from "./patterns/Observer.js";
import { MessageManager } from "./patterns/MessageSystem.js";
// Observer der auf Tode reagiert und Nachrichten erstellt
class DeathMessageObserver {
    onDeath(actorType, actorId) {
        // Composite Pattern - Nachrichtengruppe mit Reaktionen erstellen
        MessageManager.getInstance().addDeathMessage(actorType, actorId);
    }
}
class MyGame extends Game {
    constructor() {
        super();
        this.shapes = [];
        // Singleton Pattern - Instanzen holen
        this.stats = GameStats.getInstance();
        this.factory = ActorFactory.getInstance();
        this.messageManager = MessageManager.getInstance();
    }
    init() {
        console.log("Falling Objects Game Started - mit Design Patterns!");
        // Observer Pattern - DeathObserver registrieren
        const deathObserver = new DeathMessageObserver();
        DeathNotifier.getInstance().addObserver(deathObserver);
        // Singleton - Preferences setzen
        this.stats.setPreference("showMessages", true);
        this.stats.setPreference("gameSpeed", 1.0);
        // Factory Pattern - Actors erstellen
        // Je 5 Circles, Rects und Triangles
        this.shapes.push(...this.factory.createMultiple("Circle", 5));
        this.shapes.push(...this.factory.createMultiple("Rect", 5));
        this.shapes.push(...this.factory.createMultiple("Triangle", 5));
        console.log(`${this.shapes.length} Actors erstellt via Factory Pattern`);
    }
    update(dt) {
        for (const shape of this.shapes) {
            shape.move(dt);
        }
    }
    render(ctx) {
        // Shapes rendern
        for (const shape of this.shapes) {
            shape.render(ctx);
        }
        // Composite Pattern - Nachrichten-System rendern (rechts)
        if (this.stats.getPreference("showMessages")) {
            this.messageManager.render(ctx);
        }
        // Singleton - Stats anzeigen (unten)
        this.renderStats(ctx);
    }
    renderStats(ctx) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 570, 580, 30);
        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.fillText(this.stats.getStatsString(), 10, 590);
    }
}
const game = new MyGame();
const framework = new GameFramework(game, 800, 600);
framework.start();
