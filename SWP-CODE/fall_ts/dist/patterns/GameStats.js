// SINGLETON PATTERN - Speichert Spielstatistiken und Preferences
export class GameStats {
    // Private constructor - verhindert direkte Instanziierung
    constructor() {
        // Tode zählen
        this.circleDeaths = 0;
        this.rectDeaths = 0;
        this.triangleDeaths = 0;
        // Preferences
        this.preferences = new Map();
        // Standardeinstellungen
        this.preferences.set("showMessages", true);
        this.preferences.set("gameSpeed", 1.0);
        this.preferences.set("maxActors", 15);
    }
    // Singleton Instanz holen
    static getInstance() {
        if (!GameStats.instance) {
            GameStats.instance = new GameStats();
        }
        return GameStats.instance;
    }
    // Tod registrieren
    registerDeath(type) {
        switch (type) {
            case "Circle":
                this.circleDeaths++;
                break;
            case "Rect":
                this.rectDeaths++;
                break;
            case "Triangle":
                this.triangleDeaths++;
                break;
        }
    }
    // Getter für Tode
    getCircleDeaths() {
        return this.circleDeaths;
    }
    getRectDeaths() {
        return this.rectDeaths;
    }
    getTriangleDeaths() {
        return this.triangleDeaths;
    }
    getTotalDeaths() {
        return this.circleDeaths + this.rectDeaths + this.triangleDeaths;
    }
    // Preferences Methoden
    setPreference(key, value) {
        this.preferences.set(key, value);
    }
    getPreference(key) {
        return this.preferences.get(key);
    }
    // Reset für neues Spiel
    reset() {
        this.circleDeaths = 0;
        this.rectDeaths = 0;
        this.triangleDeaths = 0;
    }
    // Stats als String
    getStatsString() {
        return `Tode: Kreise: ${this.circleDeaths} | Rechtecke: ${this.rectDeaths} | Dreiecke: ${this.triangleDeaths} | Gesamt: ${this.getTotalDeaths()}`;
    }
}
