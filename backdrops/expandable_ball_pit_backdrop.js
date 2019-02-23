/**************************************************************************************
 *  Backdrop Header
 **************************************************************************************/
var canvas, c;
var backdrop;

function set_bounds() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
function random_range(min, max) {
    return Math.round((Math.random() * (max - min)) + min);
}
function gather_context() {
    set_bounds();
    c = canvas.getContext('2d');
}
function const_init() {
    canvas = document.querySelector('canvas');
    set_bounds();
    c = canvas.getContext('2d');
}


/**************************************************************************************
 *  Bouncing Circles Backdrop
 **************************************************************************************/

 
/********************************************
 *  Constants
 ********************************************/
const RAD_MAX = 50;
const RAD_MIN = 5;
const RANGE = 50;
const MAX_VEL = 5;
const COLORS = [
    '#a3a3a3',
    '#7c7c7c',
    '#595959',
    '#474747',
    '#070707'
];
/********************************************
 *  Variables
 ********************************************/
var circles = [];
var mouse = {
    x: undefined,
    y: undefined,
    vx: undefined,
    vy: undefined
};
var mousedown = false;

/********************************************
 *  Window Listeners
 ********************************************/
window.addEventListener('mousemove', function(event) {
    mouse.vx = ((event.x - mouse.x) / 4) % MAX_VEL;
    mouse.vy = ((event.y - mouse.y) / 4) % MAX_VEL;
    mouse.x = event.x;
    mouse.y = event.y;
});
window.addEventListener('mousedown', function(event) {
    mousedown = true;
});
window.addEventListener('mouseup', function(event) {
    mousedown = false;
});
window.addEventListener('resize', set_bounds, false);

/********************************************
 *  Objects
 ********************************************/
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
        c.fillStyle = COLORS[color];
        c.fill();
    }
    this.tick = function() {
        if (this.x + this.radius > innerWidth) this.vx = -Math.abs(this.vx);
        else if (this.x - this.radius < 0) this.vx = Math.abs(this.vx);
        if (this.y + this.radius > innerHeight) this.vy = -Math.abs(this.vy);
        else if (this.y - this.radius < 0) this.vy = Math.abs(this.vy);
        this.x += this.vx;
        this.y += this.vy;
        if (Math.abs(mouse.x - this.x) < RANGE && Math.abs(mouse.y - this.y) < RANGE) {
            if (this.radius < RAD_MAX) this.radius += 1;
            if (mousedown) {
                this.vx = mouse.vx;
                this.vy = mouse.vy;
            }
        }
        else if (this.radius > RAD_MIN){
            this.radius -= 1;
        }
        this.draw();
    }
}

/********************************************
 *  Init and Update
 ********************************************/
function init() {
    const_init();

    for (var i = 0; i < 500; i++) {
        var radius = RAD_MIN;
        circles.push(new Circle(
            (Math.random() * (innerWidth - radius * 2) + radius),
            (Math.random() * (innerHeight - radius * 2) + radius),
            radius,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3,
            Math.floor((Math.random() * COLORS.length))
        ));
    }
}

function update() {
    window.requestAnimationFrame(update);
    c.clearRect(0, 0, innerWidth, innerHeight);
    for (var i = 0; i < circles.length; i++) {
        circles[i].tick();
    }
}
window.requestAnimationFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

init();
update();