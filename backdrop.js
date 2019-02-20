
function set_bounds() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
var canvas = document.querySelector('canvas');
set_bounds();

var c = canvas.getContext('2d');

function Circle(x, y, radius, vx, vy) {
    this.x = x;
    this.y = y; 
    this.radius = radius;
    this.vx = vx;
    this.vy = vy;

    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.strokeStyle = 'lightblue';
        c.stroke();
    }
    this.tick = function() {
        if (this.x + this.radius > innerWidth) this.vx = -Math.abs(this.vx);
        else if (this.x - this.radius < 0) this.vx = Math.abs(this.vx);
        if (this.y + this.radius > innerHeight) this.vy = -Math.abs(this.vy);
        else if (this.y - this.radius < 0) this.vy = Math.abs(this.vy);
        this.x += this.vx;
        this.y += this.vy;
        this.draw();
    }
}

var circles = [];
for (var i = 0; i < 150; i++) {
    circles.push(new Circle(
        (Math.random() * innerWidth),
        (Math.random() * innerHeight),
        30,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    ));
}

function update() {
    window.requestAnimationFrame(update);
    c.clearRect(0, 0, innerWidth, innerHeight);
    for (var i = 0; i < circles.length; i++) {
        circles[i].tick();
    }
}
update();