export class Gerade {
    constructor(startX) {
        this.startX = startX;
    }
    move(x, y, time, dt) {
        return { x: this.startX, y };
    }
}
