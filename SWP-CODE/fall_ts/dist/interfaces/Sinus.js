export class Sinus {
    constructor(startX) {
        this.startX = startX;
    }
    move(x, y, time, dt) {
        return {
            x: this.startX + Math.sin(time * 2) * 80,
            y
        };
    }
}
