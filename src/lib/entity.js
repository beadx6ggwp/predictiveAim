
class Entity {
    constructor(x = 0, y = 0, r = 20, id = 'obj') {
        this.isDead = 0;
        this.pos = new Vector(x, y);
        this.vel = new Vector();
        this.acc = new Vector();
        this.rotate = 0; // deg
        this.r = r;
        this.id = id;
        this.color = 'rgba(255,127,127,0.7)';

        this.movingType = 'bounce';
        this.objType = 'Entity';
    }

    update(dt) {
        this.vel.add(this.acc);
        this.pos.add(this.vel.clone().multiplyScalar(dt));


        switch (this.movingType) {
            case 'bounce':
                if (this.pos.x > width && this.vel.x > 0 || this.pos.x < 0 && this.vel.x < 0) this.vel.x *= -1;
                if (this.pos.y > height && this.vel.y > 0 || this.pos.y < 0 && this.vel.y < 0) this.vel.y *= -1;
                break;

            case 'crossover':
                if (this.pos.x > width && this.vel.x > 0 || this.pos.x < 0 && this.vel.x < 0) this.vel.x *= -1;
                if (this.pos.y > height && this.vel.y > 0 || this.pos.y < 0 && this.vel.y < 0) this.vel.y *= -1;
                break;
            case 'delWhenOut':
                if (this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0) this.isDead = 1;
                break;
            default:
                break;
        }
    }
    render(ctx) {
        ctx.save();
        ctx.strokeStyle = "#000";
        ctx.fillStyle = this.color;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();

        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, 1, 0, 2 * Math.PI);
        ctx.fill();


        ctx.restore();
    }
}
