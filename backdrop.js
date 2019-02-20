
function set_bounds() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
var canvas = document.querySelector('canvas');
set_bounds();

var c = canvas.getContext('2d');
var circles = [];
var mouse = {
    x: undefined,
    y: undefined,
    vx: undefined,
    vy: undefined
};
var rad_max = 50;
var rad_min = 10;
var range = 50;
var mousedown = false;
var colors = [
    'darkred',
    'darkblue',
    'darkgreen',
    'darkorange',
    'gray'
];

window.addEventListener('mousemove', function(event) {
    mouse.vx = (event.x - mouse.x) / 4;
    mouse.vy = (event.y - mouse.y) / 4;
    mouse.x = event.x;
    mouse.y = event.y;
});
window.addEventListener('mousedown', function(event) {
    mousedown = true;
});
window.addEventListener('mouseup', function(event) {
    mousedown = false;
});

function Circle(x, y, radius, vx, vy, color) {
    this.x = x;
    this.y = y; 
    this.radius = radius;
    this.vx = vx;
    this.vy = vy;
    this.color = color;

    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = colors[color];
        c.fill();
    }
    this.tick = function() {
        if (this.x + this.radius > innerWidth) this.vx = -Math.abs(this.vx);
        else if (this.x - this.radius < 0) this.vx = Math.abs(this.vx);
        if (this.y + this.radius > innerHeight) this.vy = -Math.abs(this.vy);
        else if (this.y - this.radius < 0) this.vy = Math.abs(this.vy);
        this.x += this.vx;
        this.y += this.vy;
        if (Math.abs(mouse.x - this.x) < range && Math.abs(mouse.y - this.y) < range) {
            if (this.radius < rad_max) this.radius += 1;
            if (mousedown) {
                this.vx = mouse.vx;
                this.vy = mouse.vy;
            }
        }
        else if (this.radius > rad_min){
            this.radius -= 1;
        }
        this.draw();
    }
}


for (var i = 0; i < 500; i++) {
    var radius = rad_min;
    circles.push(new Circle(
        (Math.random() * (innerWidth - radius * 2) + radius),
        (Math.random() * (innerHeight - radius * 2) + radius),
        radius,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        Math.floor((Math.random() * colors.length))
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