export class MyRectangle {
    constructor(x = 100, y = 40, color = '#FF0000', width = 10, height = 10) {
        this.x = 100;
        this.y = 50;
        this.color = '#FF0000';
        this.x = x;
        this.y = this.y;
        this.color = color;
        this.width = width;
        this.height = height;
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
        ctx.fillStyle = this.color; // Farbe (rot)
        //
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
