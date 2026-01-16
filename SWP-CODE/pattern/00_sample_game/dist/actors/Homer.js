export class Homer {
    constructor() {
        this.x = 100;
    }
    move(delta) {
        this.x++;
        if (this.x > 600) {
            this.x = 0;
        }
        console.log("x:", this.x);
    }
    render(ctx) {
        console.log("rendering");
        ctx.fillStyle = '#FF0000'; // Farbe (rot)
        ctx.fillRect(this.x, 50, 50, 50);
    }
}
