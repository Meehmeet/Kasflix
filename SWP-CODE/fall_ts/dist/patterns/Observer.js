// OBSERVER PATTERN - Beobachtet welche Objekte sterben
// Konkretes Subject - verwaltet alle Observer
export class DeathNotifier {
    constructor() {
        this.observers = [];
    }
    static getInstance() {
        if (!DeathNotifier.instance) {
            DeathNotifier.instance = new DeathNotifier();
        }
        return DeathNotifier.instance;
    }
    addObserver(observer) {
        this.observers.push(observer);
    }
    removeObserver(observer) {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }
    notifyDeath(actorType, actorId) {
        for (const observer of this.observers) {
            observer.onDeath(actorType, actorId);
        }
    }
}
