const WEIGHT_PER_UNIT = 1;

function Body(game, size, x, y) {
    this.player = 1;
    this.radius = size;
    this.color = "White"
    this.startingX = x;
    this.startingY = y;
    this.timeCreated = (()=>{return game.timeElapsed})();
    Entity.call(this, game, x, y);//, );

    this.velocity = { x: 0, y: 0 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    /*if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }*/
};

Body.prototype = new Entity();
Body.prototype.constructor = Body;

Body.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Body.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Body.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

Body.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Body.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

Body.prototype.existsYet = function () {
    return (this.game.timeElapsed >= this.timeCreated);
};

Body.prototype.update = function () {
    if (this.existsYet()) {
        Entity.prototype.update.call(this);
        //  console.log(this.velocity);


        //These refer to collision with the screen.
        if (this.collideLeft() || this.collideRight()) {
            this.velocity.x = 0;//-this.velocity.x * friction;
            if (this.collideLeft()) this.x = this.radius;
            if (this.collideRight()) this.x = 800 - this.radius;
            //this.x += this.velocity.x * this.game.clockTick;
            //this.y += this.velocity.y * this.game.clockTick;
        }

        if (this.collideTop() || this.collideBottom()) {
            this.velocity.y = 0;//-this.velocity.y * friction;
            if (this.collideTop()) this.y = this.radius;
            if (this.collideBottom()) this.y = 800 - this.radius;
            //this.x += this.velocity.x * this.game.clockTick;
            //this.y += this.velocity.y * this.game.clockTick;
        }

        var collisionCount = 0;
        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];

            if (ent != this && ent.existsYet()) {
                if (this.collide(ent)) {
                    collisionCount++;
                }

                var dist = distance(this, ent);

                var dX = this.x - ent.x;
                var dY = this.y - ent.y;

                var rAngle = Math.atan2(dY, dX) * -1;

                var thisMass = WEIGHT_PER_UNIT * (Math.PI * this.radius ^ 2);
                var entMass = WEIGHT_PER_UNIT * (Math.PI * ent.radius ^ 2);

                var gravitationalForce = thisMass * entMass / distance ^ 2;
                gravitationalForce *= entMass / thisMass;

                this.velocity.x += gravitationalForce * Math.cos(rAngle) * this.game.clockTick;
                this.velocity.y += gravitationalForce * Math.sin(rAngle) * this.game.clockTick;

            }
        }

        var r = 255;//Math.max(0, 255 - (10 * collisionCount));
        var g = Math.max(0, 255 - (25 * collisionCount));
        var b = Math.max(0, 255 - (10 * collisionCount));// - (255 * this.game.entities.length / collisionCount );
        //console.log(b);
        this.color = "rgb(" + r + ", " + g + ", " + b + ")";

        this.x -= this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }
};

Body.prototype.draw = function (ctx) {
    if (this.existsYet()) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
    }
};

