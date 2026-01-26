import { Game, GameFramework } from "./GameFramework.js";
import { Actor } from "./actors/Actor.js";
import { ActorFactory } from "./patterns/ActorFactory.js";
import { GameStats } from "./patterns/GameStats.js";
import { DeathNotifier, DeathObserver } from "./patterns/Observer.js";
import { MessageManager } from "./patterns/MessageSystem.js";

// Observer der auf Tode reagiert und Nachrichten erstellt
class DeathMessageObserver implements DeathObserver {
  onDeath(actorType: string, actorId: number): void {
    // Composite Pattern - Nachrichtengruppe mit Reaktionen erstellen
    MessageManager.getInstance().addDeathMessage(actorType, actorId);
  }
}

class MyGame extends Game {
  private shapes: Actor[] = [];
  private stats: GameStats;
  private factory: ActorFactory;
  private messageManager: MessageManager;

  constructor() {
    super();
    // Singleton Pattern - Instanzen holen
    this.stats = GameStats.getInstance();
    this.factory = ActorFactory.getInstance();
    this.messageManager = MessageManager.getInstance();
  }

  init(): void {
    console.log("Falling Objects Game Started - mit Design Patterns!");
    
    // Observer Pattern - DeathObserver registrieren
    const deathObserver = new DeathMessageObserver();
    DeathNotifier.getInstance().addObserver(deathObserver);
    
    // Singleton - Preferences setzen
    this.stats.setPreference("showMessages", true);
    this.stats.setPreference("gameSpeed", 1.0);
    
    // Factory Pattern - Actors erstellen
    // Variante 1: createObject erstellt je 5 von jedem Typ
    this.shapes = this.factory.createObject(5);
    
    // this.shapes.push(...this.factory.createMultiple("Circle", 5));
    // this.shapes.push(...this.factory.createMultiple("Rect", 5));
    // this.shapes.push(...this.factory.createMultiple("Triangle", 5));

    
    console.log(`${this.shapes.length} Actors erstellt via Factory Pattern`);
  }

  update(dt: number): void {
    for (const shape of this.shapes) {
      shape.move(dt);
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Shapes rendern
    for (const shape of this.shapes) {
      shape.render(ctx);
    }
    
    // Composite Pattern - Nachrichten-System rendern (rechts)
    if (this.stats.getPreference<boolean>("showMessages")) {
      this.messageManager.render(ctx);
    }
    
    // Singleton - Stats anzeigen (unten)
    this.renderStats(ctx);
  }

  private renderStats(ctx: CanvasRenderingContext2D): void {
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
