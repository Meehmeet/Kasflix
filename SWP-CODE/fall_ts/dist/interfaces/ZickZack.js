export class ZickZack {
    constructor(startX) {
        this.startX = startX;
    }
    move(x, y, time, dt) {
        return {
            x: this.startX + Math.sin(time * 3) * 100 * dt * 50,
            y
        };
    }
}
