

class Shooter extends Entity {
    constructor(x, y, r = 20) {
        super(x, y, r);
        this.objType = 'Shooter';

        this.lastShoot = Date.now();
        this.shootDelay = 300;

        this.target = null;
    }

    update(dt) {
        if (this.target && Date.now() - this.lastShoot >= this.shootDelay) {
            this.shoot(this.target);

            this.lastShoot = Date.now();
        }

        super.update(dt);
    }
    shoot(target) {
        let bullet = new Bullet(this.pos.x, this.pos.y, 5, target);
        bullet.setVelByPredictive();
        // bullet.setVelByDirectTargetPos();
        entities.push(bullet);
    }
}

class Bullet extends Entity {
    constructor(x, y, r = 5, entity) {
        super(x, y, r);
        this.objType = 'Bullet';
        this.speed = 400;

        this.startPos = new Vector(x, y);
        this.endPos = null;

        this.targetPos = entity.pos.clone();
        this.target = entity;


        this.movingType = 'delWhenOut';

        this.color = 'rgba(255,255,255,0.4)';
    }
    setVelByDirectTargetPos() {
        let dir = this.targetPos.clone().subtract(this.startPos).norm();
        this.vel = dir;
        this.vel.setLength(this.speed);

        this.endPos = this.targetPos;
    }
    setVelByPredictive() {
        let result = interceptionDirection(this.startPos, this.targetPos, this.speed, this.target.vel);
        this.vel = result.dir;
        this.vel.setLength(this.speed);

        this.endPos = result.hitPoint;
    }

    update(dt) {
        super.update(dt);
    }
    render(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(255,50,60,0.8)';
        ctx.strokeStyle = 'rgba(255,200,127,0.8)';
        ctx.beginPath();
        ctx.arc(this.endPos.x, this.endPos.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        // ctx.stroke();
        ctx.restore();

        super.render(ctx);
    }
}


/**
 * https://jsdoc.app/
 * @param {Vector} p shooter position
 * @param {Vector} tar Target curr position
 * @param {Number} sA speed of bullet
 * @param {Vector} vT vel of target moving
 * @returns {Object} hitPoint:location of interceptionDirection, dir:direction
 */
function interceptionDirection(p, tar, sA, vT) {
    let result = {
        hitPoint: null,
        dir: null
    };

    let sB = vT.length();
    let targetToShooter = p.clone().subtract(tar);
    let tsLen = targetToShooter.length();
    let r = sB / sA;
    let cosAlpha = vT.dot(targetToShooter) / (tsLen * sB);

    let solve = solveQuadratic(1 - r * r, 2 * r * tsLen * cosAlpha, -(tsLen * tsLen));

    if (solve.discriminant == 0) {
        result.dir = new Vector(0, 0);
        return result
    }

    let shooterToHitpointLen = Math.max(solve.root1, solve.root2);
    let t = shooterToHitpointLen / sA;

    // hitPoint = T + vT*t
    let hitPoint = tar.clone().add(vT.clone().multiplyScalar(t));
    result.hitPoint = hitPoint
    result.dir = hitPoint.clone().subtract(p).norm();

    return result;
}

/**
 * 
 * @param {Number} a ax^2
 * @param {Number} b bx
 * @param {Number} c c
 * @returns {object} root1,root2,discriminant
 */
function solveQuadratic(a, b, c) {
    let discriminant = b * b - 4 * a * c;
    let result = {};
    if (discriminant < 0) {
        // 無解 應該是出現在子彈速度太慢追不上
        result.root1 = Infinity;
        result.root2 = -Infinity;
        result.discriminant = 0;
        return result;
    }
    result.root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    result.root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    result.discriminant = discriminant > 0 ? 2 : 1;
    return result;
}