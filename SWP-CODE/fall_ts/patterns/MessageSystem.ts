// COMPOSITE PATTERN - Nachrichten-System mit Reaktionen

// Component Interface
export interface MessageComponent {
  getMessage(): string;
  render(ctx: CanvasRenderingContext2D, x: number, y: number): number; // Gibt Höhe zurück
}

// Leaf - Einzelne Nachricht
export class Message implements MessageComponent {
  private text: string;
  private color: string;
  private timestamp: number;

  constructor(text: string, color: string = "#333") {
    this.text = text;
    this.color = color;
    this.timestamp = Date.now();
  }

  getMessage(): string {
    return this.text;
  }

  getTimestamp(): number {
    return this.timestamp;
  }

  render(ctx: CanvasRenderingContext2D, x: number, y: number): number {
    ctx.fillStyle = this.color;
    ctx.font = "12px Arial";
    ctx.fillText(this.text, x, y);
    return 15; // Höhe einer Nachricht
  }
}

// Composite - Nachrichtengruppe (z.B. Tod + Reaktionen)
export class MessageGroup implements MessageComponent {
  private children: MessageComponent[] = [];
  private title: string;

  constructor(title: string) {
    this.title = title;
  }

  add(component: MessageComponent): void {
    this.children.push(component);
  }

  remove(component: MessageComponent): void {
    const index = this.children.indexOf(component);
    if (index > -1) {
      this.children.splice(index, 1);
    }
  }

  getMessage(): string {
    return this.title + ": " + this.children.map(c => c.getMessage()).join(" | ");
  }

  render(ctx: CanvasRenderingContext2D, x: number, y: number): number {
    let totalHeight = 0;
    
    // Titel rendern
    ctx.fillStyle = "#000";
    ctx.font = "bold 12px Arial";
    ctx.fillText(this.title, x, y);
    totalHeight += 15;
    
    // Kinder rendern (eingerückt)
    for (const child of this.children) {
      totalHeight += child.render(ctx, x + 10, y + totalHeight);
    }
    
    return totalHeight + 5; // Extra Abstand
  }
}

// Message Manager - verwaltet alle Nachrichten
export class MessageManager {
  private static instance: MessageManager;
  private messages: MessageGroup[] = [];
  private maxMessages: number = 8;

  private constructor() {}

  public static getInstance(): MessageManager {
    if (!MessageManager.instance) {
      MessageManager.instance = new MessageManager();
    }
    return MessageManager.instance;
  }

  public addDeathMessage(deadType: string, deadId: number): void {
    const group = new MessageGroup(`💀 ${deadType} #${deadId} stirbt!`);
    
    // Reaktionen von anderen Shapes hinzufügen
    const reactions = this.generateReactions(deadType);
    for (const reaction of reactions) {
      group.add(reaction);
    }
    
    this.messages.unshift(group);
    
    // Alte Nachrichten entfernen
    if (this.messages.length > this.maxMessages) {
      this.messages.pop();
    }
  }

  private generateReactions(deadType: string): Message[] {
    const reactions: Message[] = [];
    const types = ["Kreis", "Rechteck", "Dreieck"];
    const colors: { [key: string]: string } = {
      "Kreis": "green",
      "Rechteck": "red",
      "Dreieck": "blue"
    };
    
    const reactionTexts = [
      "sagt: 'Oh nein!'",
      "sagt: 'Haha!'",
      "sagt: 'Tschüss!'",
      "sagt: 'Ruhe in Frieden!'",
      "weint 😢",
      "lacht 😂",
      "ist traurig 😔",
      "sagt: 'Bis bald!'",
    ];
    
    // 2 zufällige Reaktionen von anderen Shapes
    for (let i = 0; i < 2; i++) {
      const otherTypes = types.filter(t => t !== deadType);
      const reactorType = otherTypes[Math.floor(Math.random() * otherTypes.length)];
      const reactionText = reactionTexts[Math.floor(Math.random() * reactionTexts.length)];
      
      reactions.push(new Message(`${reactorType} ${reactionText}`, colors[reactorType]));
    }
    
    return reactions;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    const startX = 600;
    let currentY = 30;
    
    // Hintergrund für Nachrichten-Bereich
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillRect(590, 10, 205, 280);
    ctx.strokeStyle = "#333";
    ctx.strokeRect(590, 10, 205, 280);
    
    // Titel
    ctx.fillStyle = "#000";
    ctx.font = "bold 14px Arial";
    ctx.fillText("📢 Nachrichten", startX, currentY);
    currentY += 20;
    
    // Nachrichten rendern
    for (const group of this.messages) {
      currentY += group.render(ctx, startX, currentY);
    }
  }

  public clear(): void {
    this.messages = [];
  }
}
