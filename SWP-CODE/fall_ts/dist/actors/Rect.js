import { DeathNotifier } from "../patterns/Observer.js";
import { GameStats } from "../patterns/GameStats.js";
export class Rect {
    constructor(startX, movement1, movement2, movement3, id = 0) {
        this.time = 0;
        this.id = id;
        this.startX = startX;
        this.x = startX;
        this.y = Math.random() * -300;
        this.speed = Math.random() * 50 + 50;
        this.movement = movement1;
        this.movement2 = movement2;
        this.movement3 = movement3;
        this.currentMovement = movement1;
    }
    getType() {
        return "Rechteck";
    }
    move(dt) {
        this.time += dt;
        this.y += this.speed * dt;
        // Wechsle Movement bei y > 300
        if (this.y > 300 && this.currentMovement === this.movement) {
            this.currentMovement = Math.random() > 0.5 ? this.movement2 : this.movement3;
        }
        const pos = this.currentMovement.move(this.x, this.y, this.time, dt);
        this.x = pos.x;
        if (this.y > 650) {
            // Tod registrieren via Observer und Singleton
            GameStats.getInstance().registerDeath("Rect");
            DeathNotifier.getInstance().notifyDeath(this.getType(), this.id);
            // Respawn
            this.y = Math.random() * -300;
            this.x = this.startX;
            this.time = 0;
            this.currentMovement = this.movement;
        }
    }
    render(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x - 20, this.y - 20, 40, 40);
        // ID anzeigen
        ctx.fillStyle = "white";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`${this.id}`, this.x, this.y + 4);
        ctx.textAlign = "left";
    }
}
