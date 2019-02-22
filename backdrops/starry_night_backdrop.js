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
 *  Starry Night Backdrop
 **************************************************************************************/


/********************************************
 *  Constants
 ********************************************/
const NUM_PARTICLES = 500;
const MIN_RADIUS = 2;
const MAX_RADIUS = 10;
const MOVE_CONSTANT = 0.01;
const colors = [
    '#7c7c7c',
    '#696969',
    '#595959',
    '#353535',
];


/********************************************
 *  Variables
 ********************************************/
var mouse = {
    x: 0,
    y: 0
};
var particles = [];


/********************************************
 *  Window Listeners
 ********************************************/
window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});
window.addEventListener('resize', init, false);


/********************************************
 *  Objects
 ********************************************/
function Particle(x, y, radius, color) {
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y; 
    this.radius = radius;
    this.color = color;

    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = colors[this.color];
        c.fill();
    }
    this.tick = function() {

        this.x = this.startX - (mouse.x - this.startX) * (this.radius * this.radius / MAX_RADIUS) * MOVE_CONSTANT;
        this.y = this.startY - (mouse.y - this.startY) * (this.radius * this.radius / MAX_RADIUS) * MOVE_CONSTANT;

        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) return;
        if (this.y + this.radius > innerHeight || this.y - this.radius < 0) return;
        this.draw();
    }
}


/********************************************
 *  Init and Update
 ********************************************/
function init() {
    const_init();

    for (var i = 0; i < NUM_PARTICLES; i++) {
        radius = random_range(MIN_RADIUS, MAX_RADIUS);
        particles.push(
            new Particle(
                    random_range(0, innerWidth),
                    random_range(0, innerHeight),
                    radius,
                    Math.floor((1 - (radius / MAX_RADIUS)) * colors.length)
                    )
        );
    }
    particles.sort(function(a, b){return a.radius - b.radius});
}

function update() {
    window.requestAnimationFrame(update);
    c.clearRect(0, 0, innerWidth, innerHeight);
    for (var i in particles) {
        particles[i].tick();
    }
}

init();
update();