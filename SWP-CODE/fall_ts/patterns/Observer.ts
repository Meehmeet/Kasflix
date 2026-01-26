// OBSERVER PATTERN - Beobachtet welche Objekte sterben

export interface DeathObserver {
  onDeath(actorType: string, actorId: number): void;
}

export interface DeathSubject {
  addObserver(observer: DeathObserver): void;
  removeObserver(observer: DeathObserver): void;
  notifyDeath(actorType: string, actorId: number): void;
}

// Konkretes Subject - verwaltet alle Observer
export class DeathNotifier implements DeathSubject {
  private static instance: DeathNotifier;
  private observers: DeathObserver[] = [];

  private constructor() {}

  public static getInstance(): DeathNotifier {
    if (!DeathNotifier.instance) {
      DeathNotifier.instance = new DeathNotifier();
    }
    return DeathNotifier.instance;
  }

  public addObserver(observer: DeathObserver): void {
    this.observers.push(observer);
  }

  public removeObserver(observer: DeathObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  public notifyDeath(actorType: string, actorId: number): void {
    for (const observer of this.observers) {
      observer.onDeath(actorType, actorId);
    }
  }
}
