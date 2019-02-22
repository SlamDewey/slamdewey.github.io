/*
    This uses a 2D spacial division 'QuadTree' to manage a set of orbs
    that bounce around the screen and are range detected.  This animated
    background uses self-written code and is available at:

    https://github.com/SlamDewey/slamdewey.github.io/

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
function random_RANGE(min, max) {
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
const MAX_RADIUS = 10;
const MOVE_CONSTANT = 0.01;
const NUM_BALLS = 150;
const RAD_MIN = 5;
const RAD_MAX = 15;
const RANGE = 100;
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
var qtree;
var circles = [];
var dictionary = {};
var mouse = {
    x: 0,
    y: 0
}

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
function Circle(x, y, radius, vx, vy, color, id) {
    this.x = x;
    this.y = y; 
    this.radius = radius;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.id = id;
    this.bounds = new AABB(x, y, radius, radius);
    this.drawx = x;
    this.drawy = y;

    this.draw = function() {
        c.beginPath();
        c.arc(this.drawx, this.drawy, this.radius, 0, Math.PI * 2, false);
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

        this.drawx = this.x - (mouse.x - this.x) * (this.radius * this.radius / MAX_RADIUS) * MOVE_CONSTANT;
        this.drawy = this.y - (mouse.y - this.y) * (this.radius * this.radius / MAX_RADIUS) * MOVE_CONSTANT;

        this.draw();
    }
    this.toString = function() {return "Circle: (", + this.x + ", " + this.y + ")";}
}


/********************************************
 *  Functions
 ********************************************/
function key(id1, id2) {
    if (id1 < id2) return id1 + "," + id2;
    return id2 + "," + id1;
}

/********************************************
 *  Init and Update
 ********************************************/
function init() {
    const_init();

    qtree = new QuadTree(new AABB(innerWidth / 2, innerHeight / 2, innerWidth, innerHeight));
    for (var i = 0; i < NUM_BALLS; i++) {
        var radius = RAD_MIN;
        circles.push(new Circle(
            (Math.random() * (innerWidth - radius * 2) + radius),
            (Math.random() * (innerHeight - radius * 2) + radius),
            radius,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3,
            Math.floor((Math.random() * COLORS.length)),
            i
        ));
    }
}

function update() {
    window.requestAnimationFrame(update);
    c.clearRect(0, 0, innerWidth, innerHeight);
    //update balls
    for (var i = 0; i < circles.length; i++) {
        circles[i].tick();
        qtree.insert(circles[i]);
    }
    var bounds;
    for (var i in circles) {
        bounds = new AABB(circles[i].x, circles[i].y, RANGE, RANGE);
        var members = [];
        qtree.getObjectsInBounds(bounds, members);
        for (var j in members) {
            if (circles[i] == members[j]) continue;
            if (dictionary[key(circles[i].id, members[j].id)]) continue;
            dictionary[key(circles[i].id, members[j].id)] = true;
            var dx = (circles[i].x - members[j].x),
                dy = (circles[i].y - members[j].y),
                d;
                d = Math.sqrt(dx * dx + dy * dy);
            if (d < RANGE) {
                c.strokeStyle = 'black';
                c.beginPath();
                c.moveTo(circles[i].drawx, circles[i].drawy);
                c.lineTo(members[j].drawx, members[j].drawy);
                c.stroke();
                }
            }
        }
    dictionary = {};
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