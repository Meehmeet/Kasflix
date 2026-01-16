export class Circle {
    constructor(startX, movement1, movement2, movement3) {
        this.time = 0;
        this.startX = startX;
        this.x = startX;
        this.y = Math.random() * -300;
        this.speed = Math.random() * 50 + 50;
        this.movement = movement1;
        this.movement2 = movement2;
        this.movement3 = movement3;
        this.currentMovement = movement1;
    }
    move(dt) {
        this.time += dt;
        this.y += this.speed * dt;
        // Wechsle Movement bei y > 300
        if (this.y > 300 && this.currentMovement === this.movement) {
            this.currentMovement = Math.random() > 0.5 ? this.movement2 : this.movement3;
        }
        const pos = this.currentMovement.move(this.x, this.y, this.time, dt);
        this.x = pos.x;
        if (this.y > 650) {
            this.y = Math.random() * -300;
            this.x = this.startX;
            this.time = 0;
            this.currentMovement = this.movement;
        }
    }
    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = "green";
        ctx.fill();
    }
}
