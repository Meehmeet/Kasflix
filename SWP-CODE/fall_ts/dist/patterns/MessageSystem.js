// COMPOSITE PATTERN - Nachrichten-System mit Reaktionen
// Leaf - Einzelne Nachricht
export class Message {
    constructor(text, color = "#333") {
        this.text = text;
        this.color = color;
        this.timestamp = Date.now();
    }
    getMessage() {
        return this.text;
    }
    getTimestamp() {
        return this.timestamp;
    }
    render(ctx, x, y) {
        ctx.fillStyle = this.color;
        ctx.font = "12px Arial";
        ctx.fillText(this.text, x, y);
        return 15; // Höhe einer Nachricht
    }
}
// Composite - Nachrichtengruppe (z.B. Tod + Reaktionen)
export class MessageGroup {
    constructor(title) {
        this.children = [];
        this.title = title;
    }
    add(component) {
        this.children.push(component);
    }
    remove(component) {
        const index = this.children.indexOf(component);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }
    getMessage() {
        return this.title + ": " + this.children.map(c => c.getMessage()).join(" | ");
    }
    render(ctx, x, y) {
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
    constructor() {
        this.messages = [];
        this.maxMessages = 8;
    }
    static getInstance() {
        if (!MessageManager.instance) {
            MessageManager.instance = new MessageManager();
        }
        return MessageManager.instance;
    }
    addDeathMessage(deadType, deadId) {
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
    generateReactions(deadType) {
        const reactions = [];
        const types = ["Kreis", "Rechteck", "Dreieck"];
        const colors = {
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
    render(ctx) {
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
    clear() {
        this.messages = [];
    }
}
