// FACTORY PATTERN - Erstellt Actor-Objekte
import { Circle } from "../actors/Circle.js";
import { Rect } from "../actors/Rect.js";
import { Triangle } from "../actors/Triangle.js";
import { Gerade } from "../interfaces/Gerade.js";
import { Sinus } from "../interfaces/Sinus.js";
import { ZickZack } from "../interfaces/ZickZack.js";
// Konkrete Factory
export class ActorFactory {
    constructor() {
        this.nextId = 1;
    }
    static getInstance() {
        if (!ActorFactory.instance) {
            ActorFactory.instance = new ActorFactory();
        }
        return ActorFactory.instance;
    }
    createActor(type) {
        const startX = Math.random() * 500 + 20; // Platz für Nachrichten rechts lassen
        const id = this.nextId++;
        // Movement-Strategien erstellen
        const move1 = new Gerade(startX);
        const move2 = new Sinus(startX);
        const move3 = new ZickZack(startX);
        switch (type) {
            case "Circle":
                return new Circle(startX, move1, move2, move3, id);
            case "Rect":
                return new Rect(startX, move1, move2, move3, id);
            case "Triangle":
                return new Triangle(startX, move1, move2, move3, id);
            default:
                throw new Error(`Unbekannter Actor-Typ: ${type}`);
        }
    }
    // Mehrere Actors eines Typs erstellen
    createMultiple(type, count) {
        const actors = [];
        for (let i = 0; i < count; i++) {
            actors.push(this.createActor(type));
        }
        return actors;
    }
    // Zufälligen Actor erstellen
    createRandom() {
        const types = ["Circle", "Rect", "Triangle"];
        const randomType = types[Math.floor(Math.random() * types.length)];
        return this.createActor(randomType);
    }
    // ID zurücksetzen (für neues Spiel)
    resetIds() {
        this.nextId = 1;
    }
}
