export class GameStats {
  private static instance: GameStats;
  
  // Tode zählen
  private circleDeaths: number = 0;
  private rectDeaths: number = 0;
  private triangleDeaths: number = 0;
  
  // Preferences
  private preferences: Map<string, any> = new Map();

  // Private constructor - verhindert direkte Instanziierung
  private constructor() {
    // Standardeinstellungen
    this.preferences.set("showMessages", true);
    this.preferences.set("gameSpeed", 1.0);
    this.preferences.set("maxActors", 15);
  }

  // Singleton Instanz holen
  public static getInstance(): GameStats {
    if (!GameStats.instance) {
      GameStats.instance = new GameStats();
    }
    return GameStats.instance;
  }

  // Tod registrieren
  public registerDeath(type: "Circle" | "Rect" | "Triangle"): void {
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
  public getCircleDeaths(): number {
    return this.circleDeaths;
  }

  public getRectDeaths(): number {
    return this.rectDeaths;
  }

  public getTriangleDeaths(): number {
    return this.triangleDeaths;
  }

  public getTotalDeaths(): number {
    return this.circleDeaths + this.rectDeaths + this.triangleDeaths;
  }

  // Preferences Methoden
  public setPreference(key: string, value: any): void {
    this.preferences.set(key, value);
  }

  public getPreference<T>(key: string): T | undefined {
    return this.preferences.get(key) as T;
  }

  // Reset für neues Spiel
  public reset(): void {
    this.circleDeaths = 0;
    this.rectDeaths = 0;
    this.triangleDeaths = 0;
  }

  // Stats als String
  public getStatsString(): string {
    return `Tode: Kreise: ${this.circleDeaths} | Rechtecke: ${this.rectDeaths} | Dreiecke: ${this.triangleDeaths} | Gesamt: ${this.getTotalDeaths()}`;
  }
}
