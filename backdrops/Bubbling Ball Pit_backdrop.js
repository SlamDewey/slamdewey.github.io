/*
    This uses a 2D spacial division 'QuadTree' to manage a set of orbs
    that bounce around the screen and are range detected.  This animated
    background uses self-written code and is available at:

    https://github.com/SlamDewey/slamdewey.github.io/
            -check subfolder: /backdrops

    Aforementioned dependencies:
        @see "../javascript_dependencies/spacial/QuadTree.js"
        @see "../javascript_dependencies/spacial/AABB.js"

    Copyright (c) 2019 Jared Massa

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

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
function load_backdrop_speciic_content() {
    $("#parent").append(
        "<div class=\"option-selection-button\" onclick=\"init()\">Re-Initialize Backdrop</div>"
    );
}


/**************************************************************************************
 *  Bouncing Circles Backdrop
 **************************************************************************************/

 
/********************************************
 *  Constants
 ********************************************/
const RAD_MAX = 50;
const RAD_MIN = 5;
const RANGE = 200;
const MAX_VEL = 5;
const RELAXED_VEL = 2;
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
var qtree;

/********************************************
 *  Window Listeners
 ********************************************/
window.addEventListener('mousemove', function(event) {
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
    this.collided = false;

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
        if (!this.collided && this.radius > RAD_MIN){
            this.radius -= 2;
        }
        if (this.radius < RAD_MIN) this.radius = RAD_MIN;
        if (this.vx > RELAXED_VEL) this.vx -= 0.1;
        if (this.vx < -RELAXED_VEL) this.vx += 0.1;
        if (this.vy > RELAXED_VEL) this.vy -= 0.1;
        if (this.vy < -RELAXED_VEL) this.vy += 0.1;
        this.collided = false;
    }
    this.onCollision = function() {
        this.collided = true;
        var xdis = mouse.x - this.x, ydis = mouse.y - this.y;
        var d = Math.sqrt(xdis * xdis + ydis * ydis);
        var rad_to_get_to = ((RANGE - d) / RANGE) * RAD_MAX + RAD_MIN;
        if (d < RANGE) {
            if (this.radius < rad_to_get_to) this.radius += 2;
            if (this.radius > rad_to_get_to) this.radius = rad_to_get_to;
            if (mousedown) {

                this.vx = -(xdis / RANGE * MAX_VEL);
                this.vy = -(ydis / RANGE * MAX_VEL);
            }
        }
    }
}

/********************************************
 *  Init and Update
 ********************************************/
function init() {
    const_init();

    circles = [];
    qtree = new QuadTree(new AABB(innerWidth / 2, innerHeight / 2, innerWidth / 2, innerHeight / 2), 1);

    for (var i = 0; i < 500; i++) {
        var radius = RAD_MIN;
        circles.push(new Circle(
            (Math.random() * (innerWidth - radius * 2) + radius),
            (Math.random() * (innerHeight - radius * 2) + radius),
            radius,
            (Math.random() - 0.5) * RELAXED_VEL,
            (Math.random() - 0.5) * RELAXED_VEL,
            Math.floor((Math.random() * COLORS.length))
        ));
    }
}

function update() {
    window.requestAnimationFrame(update);
    c.clearRect(0, 0, innerWidth, innerHeight);
    for (var i = 0; i < circles.length; i++) {
        circles[i].tick();
        qtree.insert(circles[i]);
    }
    var m = [];
    qtree.getObjectsInBounds(new AABB(mouse.x, mouse.y, RANGE, RANGE), m);
    for (var i in m) {
        m[i].onCollision();
    }
    for (var i = 0; i < circles.length; i++) {
        circles[i].draw();
    }
    qtree.reset();
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