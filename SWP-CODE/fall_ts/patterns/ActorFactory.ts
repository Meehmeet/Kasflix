// FACTORY PATTERN - Erstellt Actor-Objekte

import { Actor } from "../actors/Actor.js";
import { Circle } from "../actors/Circle.js";
import { Rect } from "../actors/Rect.js";
import { Triangle } from "../actors/Triangle.js";
import { Gerade } from "../interfaces/Gerade.js";
import { Sinus } from "../interfaces/Sinus.js";
import { ZickZack } from "../interfaces/ZickZack.js";
import { Move } from "../interfaces/Move.js";

export type ActorType = "Circle" | "Rect" | "Triangle";

// Factory Interface
export interface IActorFactory {
  createActor(type: ActorType): Actor;
}

export class ActorFactory implements IActorFactory {
  private static instance: ActorFactory;
  private nextId: number = 1;

  private constructor() {}

  public static getInstance(): ActorFactory {
    if (!ActorFactory.instance) {
      ActorFactory.instance = new ActorFactory();
    }
    return ActorFactory.instance;
  }

  public createActor(type: ActorType): Actor {
    const startX = Math.random() * 500 + 20; // Platz für Nachrichten rechts lassen
    const id = this.nextId++;
    
    // Movement-Strategien erstellen
    const move1: Move = new Gerade(startX);
    const move2: Move = new Sinus(startX);
    const move3: Move = new ZickZack(startX);

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
  public createMultiple(type: ActorType, count: number): Actor[] {
    const actors: Actor[] = [];
    for (let i = 0; i < count; i++) {
      actors.push(this.createActor(type));
    }
    return actors;
  }

  // Zufälligen Actor erstellen
  public createRandom(): Actor {
    const types: ActorType[] = ["Circle", "Rect", "Triangle"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    return this.createActor(randomType);
  }

  public createObject(number: number): Actor[] {
    const types: ActorType[] = ["Circle", "Rect", "Triangle"];
    const allActors: Actor[] = [];
    for (let i = 0; i < 3; i++) {
      const actors = this.createMultiple(types[i], number);
      allActors.push(...actors);
    }
    return allActors;
  }
  
  // ID zurücksetzen (für neues Spiel)
  public resetIds(): void {
    this.nextId = 1;
  }
}
