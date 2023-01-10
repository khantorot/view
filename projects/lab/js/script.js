const utils = {
    norm: function (value, min, max) {
        return (value - min) / (max - min);
    },

    lerp: function (norm, min, max) {
        return (max - min) * norm + min;
    },

    map: function (value, sourceMin, sourceMax, destMin, destMax) {
        return utils.lerp(utils.norm(value, sourceMin, sourceMax), destMin, destMax);
    },

    clamp: function (value, min, max) {
        return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
    },

    distance: function (p0, p1) {
        var dx = p1.x - p0.x,
            dy = p1.y - p0.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    distanceXY: function (x0, y0, x1, y1) {
        var dx = x1 - x0,
            dy = y1 - y0;
        return Math.sqrt(dx * dx + dy * dy);
    },

    circleCollision: function (c0, c1) {
        return utils.distance(c0, c1) <= c0.radius + c1.radius;
    },

    circlePointCollision: function (x, y, circle) {
        return utils.distanceXY(x, y, circle.x, circle.y) < circle.radius;
    },

    pointInRect: function (x, y, rect) {
        return utils.inRange(x, rect.x, rect.x + rect.width) &&
            utils.inRange(y, rect.y, rect.y + rect.height);
    },

    inRange: function (value, min, max) {
        return value >= Math.min(min, max) && value <= Math.max(min, max);
    },

    rangeIntersect: function (min0, max0, min1, max1) {
        return Math.max(min0, max0) >= Math.min(min1, max1) &&
            Math.min(min0, max0) <= Math.max(min1, max1);
    },

    rectIntersect: function (r0, r1) {
        return utils.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) &&
            utils.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height);
    },

    degreesToRads: function (degrees) {
        return degrees / 180 * Math.PI;
    },

    radsToDegrees: function (radians) {
        return radians * 180 / Math.PI;
    },

    randomRange: function (min, max) {
        return min + Math.random() * (max - min);
    },

    randomInt: function (min, max) {
        return Math.floor(min + Math.random() * (max - min + 1));
    },

    roundToPlaces: function (value, places) {
        var mult = Math.pow(10, places);
        return Math.round(value * mult) / mult;
    },

    roundNearest: function (value, nearest) {
        return Math.round(value / nearest) * nearest;
    },

    quadraticBezier: function (p0, p1, p2, t, pFinal) {
        pFinal = pFinal || {};
        pFinal.x = Math.pow(1 - t, 2) * p0.x +
            (1 - t) * 2 * t * p1.x +
            t * t * p2.x;
        pFinal.y = Math.pow(1 - t, 2) * p0.y +
            (1 - t) * 2 * t * p1.y +
            t * t * p2.y;
        return pFinal;
    },

    cubicBezier: function (p0, p1, p2, p3, t, pFinal) {
        pFinal = pFinal || {};
        pFinal.x = Math.pow(1 - t, 3) * p0.x +
            Math.pow(1 - t, 2) * 3 * t * p1.x +
            (1 - t) * 3 * t * t * p2.x +
            t * t * t * p3.x;
        pFinal.y = Math.pow(1 - t, 3) * p0.y +
            Math.pow(1 - t, 2) * 3 * t * p1.y +
            (1 - t) * 3 * t * t * p2.y +
            t * t * t * p3.y;
        return pFinal;
    },

    multicurve: function (points, context) {
        var p0, p1, midx, midy;

        context.moveTo(points[0].x, points[0].y);

        for (var i = 1; i < points.length - 2; i += 1) {
            p0 = points[i];
            p1 = points[i + 1];
            midx = (p0.x + p1.x) / 2;
            midy = (p0.y + p1.y) / 2;
            context.quadraticCurveTo(p0.x, p0.y, midx, midy);
        }
        p0 = points[points.length - 2];
        p1 = points[points.length - 1];
        context.quadraticCurveTo(p0.x, p0.y, p1.x, p1.y);
    }

}





var particle = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    mass: 1,
    radius: 0,
    bounce: -1,
    friction: 1,
    gravity: 0,
    springs: null,
    gravitations: null,

    create: function (x, y, speed, direction, grav) {
        var obj = Object.create(this);
        obj.x = x;
        obj.y = y;
        obj.vx = Math.cos(direction) * speed;
        obj.vy = Math.sin(direction) * speed;
        obj.gravity = grav || 0;
        obj.springs = [];
        obj.gravitations = [];
        return obj;
    },

    addGravitation: function (p) {
        this.removeGravitation(p);
        this.gravitations.push(p);
    },

    removeGravitation: function (p) {
        for (var i = 0; i < this.gravitations.length; i += 1) {
            if (p === this.gravitations[i]) {
                this.gravitations.splice(i, 1);
                return;
            }
        }
    },

    addSpring: function (point, k, length) {
        this.removeSpring(point);
        this.springs.push({
            point: point,
            k: k,
            length: length || 0
        });
    },

    removeSpring: function (point) {
        for (var i = 0; i < this.springs.length; i += 1) {
            if (point === this.springs[i].point) {
                this.springs.splice(i, 1);
                return;
            }
        }
    },

    getSpeed: function () {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    },

    setSpeed: function (speed) {
        var heading = this.getHeading();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
    },

    getHeading: function () {
        return Math.atan2(this.vy, this.vx);
    },

    setHeading: function (heading) {
        var speed = this.getSpeed();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
    },

    accelerate: function (ax, ay) {
        this.vx += ax;
        this.vy += ay;
    },

    update: function () {
        this.handleSprings();
        this.handleGravitations();
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
    },

    handleGravitations: function () {
        for (var i = 0; i < this.gravitations.length; i += 1) {
            this.gravitateTo(this.gravitations[i]);
        }
    },

    handleSprings: function () {
        for (var i = 0; i < this.springs.length; i += 1) {
            var spring = this.springs[i];
            this.springTo(spring.point, spring.k, spring.length);
        }
    },

    angleTo: function (p2) {
        return Math.atan2(p2.y - this.y, p2.x - this.x);
    },

    distanceTo: function (p2) {
        var dx = p2.x - this.x,
            dy = p2.y - this.y;

        return Math.sqrt(dx * dx + dy * dy);
    },

    gravitateTo: function (p2) {
        var dx = p2.x - this.x,
            dy = p2.y - this.y,
            distSQ = dx * dx + dy * dy,
            dist = Math.sqrt(distSQ),
            force = p2.mass / distSQ,
            ax = dx / dist * force,
            ay = dy / dist * force;

        this.vx += ax;
        this.vy += ay;
    },

    springTo: function (point, k, length) {
        var dx = point.x - this.x,
            dy = point.y - this.y,
            distance = Math.sqrt(dx * dx + dy * dy),
            springForce = (distance - length || 0) * k;
        this.vx += dx / distance * springForce,
            this.vy += dy / distance * springForce;
    }
};









window.onload = function () {
    var canvas = document.getElementById("bubbles"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight,
        fl = 200,
        cards = [],
        numCards = 200,
        centerZ = 1000,
        baseAngle = 0,
        rotationSpeed = 0.01;


    for (var i = 0; i < numCards; i += 1) {
        var card = {
            angle: utils.randomRange(0, Math.PI * 2),
            radius: utils.randomRange(300, 3000),
            y: utils.randomRange(3000, -3000)
        };
        card.x = Math.cos(card.angle + baseAngle) * card.radius;
        card.z = centerZ + Math.sin(card.angle + baseAngle) * card.radius;
        cards.push(card);
    }

    context.translate(width / 2, height / 2);

    const colors = ["#fff", "#5f97d0", "#bb2a2a", "#6e79d7", "#d5b032"];
    let colors_id = 0;

    context.fillStyle = colors[colors_id];
    canvas.addEventListener('click', function () {
        (colors_id < colors.length - 1) ? colors_id++ : colors_id = 0;
        context.fillStyle = colors[colors_id];
    })


    document.body.addEventListener("mousemove", function (event) {
        rotationSpeed = (event.clientX - width / 2) * 0.00005;
        ypos = (event.clientY - height / 2) * 2;
    });

    update();

    function update() {
        baseAngle += rotationSpeed;
        cards.sort(zsort);
        context.clearRect(-width / 2, -height / 2, width, height);
        for (var i = 0; i < numCards; i += 1) {
            var card = cards[i],
                perspective = fl / (fl + card.z);

            context.save();
            context.scale(perspective, perspective);
            context.translate(card.x, card.y);
            context.globalAlpha = utils.map(card.y, 3000, -2000, 1, 0);

            context.beginPath();
            context.arc(0, 0, 20, 0, Math.PI * 2, false);
            context.fill();

            context.restore();

            card.x = Math.cos(card.angle + baseAngle) * card.radius;
            card.z = centerZ + Math.sin(card.angle + baseAngle) * card.radius;
            card.y -= 10;

            if (card.y < -2000) {
                card.y = 2000;
            }
        }
        requestAnimationFrame(update);
    }

    function zsort(cardA, cardB) {
        return cardB.z - cardA.z;
    }
};





const canvas = document.getElementById("logo");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];


let mouse = {
    x: null,
    y: null,
    radius: 80
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

window.addEventListener('mousemove',
    function (event) {
        mouse.x = event.x;
        mouse.y = getMousePos(canvas, event).y + document.documentElement.clientHeight / 5;
    });

function drawImage() {
    let imageWidth = png.width || png.naturalWidth;
    let imageHeight = png.height || png.naturalHeight;
    const data = ctx.getImageData(0, 0, imageWidth, imageHeight);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    class Particle {
        constructor(x, y, color, size) {
            this.x = x + canvas.width / 2 - png.width * 2,
                this.y = y + canvas.height / 2 - png.width * 2,
                this.color = color,
                this.size = 2,
                this.baseX = x + canvas.width / 2 - png.width * 2,
                this.baseY = y + canvas.height / 2 - png.width * 2,
                this.density = ((Math.random() * 10) + 2);
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        update() {
            ctx.fillStyle = this.color;

            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            var maxDistance = 100;
            var force = (maxDistance - distance) / maxDistance;

            if (force < 0) force = 0;

            let directionX = (forceDirectionX * force * this.density) * 0.9;
            let directionY = (forceDirectionY * force * this.density) * 0.9;

            if (distance < mouse.radius + this.size) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    let dy = this.y - this.baseY;
                    this.x -= dx / 5;
                } if (this.y !== this.baseY) {
                    let dx = this.x - this.baseX;
                    let dy = this.y - this.baseY;
                    this.y -= dy / 5;
                }
            }
            this.draw();
        }
    }
    function init() {
        particleArray = [];

        for (var y = 0, y2 = data.height; y < y2; y++) {
            for (var x = 0, x2 = data.width; x < x2; x++) {
                if (data.data[(y * 4 * data.width) + (x * 4) + 3] > 128) {
                    let positionX = x;
                    let positionY = y;
                    let color = "rgb(" + data.data[(y * 4 * data.width) + (x * 4)] + "," + data.data[(y * 4 * data.width) + (x * 4) + 1] + "," + data.data[(y * 4 * data.width) + (x * 4) + 2] + ")";

                    particleArray.push(new Particle(positionX * 4, positionY * 4, color));

                }
            }
        }

    }
    function animate() {
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fillRect(0, 0, innerWidth, innerHeight);


        for (let i = 0; i < particleArray.length; i++) {
            particleArray[i].update();
        }
    }
    init();
    animate();

    window.addEventListener('resize',
        function () {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            init();
        });
}


var png = new Image();
png.src = "./content/logo.png";

window.addEventListener('load', (event) => {
    ctx.drawImage(png, 0, 0);
    drawImage();
});
