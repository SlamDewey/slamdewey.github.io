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
        "<div class=\"option-selection-button\" onclick=\"toggle_mouse_demo()\">Toggle Mouse Range Demo" +
            "<span class=\"tooltiptext\">Adds bounds around the mouse and queries the tree for its contents</span>" +
        "</div>" +
        "<div class=\"option-selection-button\" onclick=\"toggle_tree_demo()\">Toggle Quad Tree Demo" +
            "<span class=\"tooltiptext\">Shows the leaf breakdown of the quad tree</span>" +
        "</div>" +
        "<div class=\"option-selection-button\" onclick=\"toggle_pan()\">Toggle Panning" +
            "<span class=\"tooltiptext\">Panning uses the mouse position and ball radius to determine draw location</span>" +
        "</div>" +
        "<div class=\"option-selection-button\" onclick=\"init()\">Re-Initialize Backdrop</div>"
        );
}


/**************************************************************************************
 *  Bouncing Circles Backdrop
 **************************************************************************************/

 
/********************************************
 *  Constants
 ********************************************/
const PAN_CONSTANT = 0.05;
const NUM_BALLS = 500;
const RAD_MAX = 5;
const RAD_MIN = 3;
const RANGE = 80;
const MAX_VEL = 3;
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
    x: 0,
    y: 0,
    vx: 0,
    vy: 0
};
var mousedown = false;
var qtree;
var mouse_range = 50;
var dictionary = {};    //to store keys when we check ball pairs

var DEMO_QUAD_TREE = false;
var DEMO_MOUSE_RANGE = false;
var PAN = true;

/********************************************
 *  Window Listeners
 ********************************************/
window.addEventListener('mousemove', function(event) {
    mouse.vx = ((event.x - mouse.x) / 4) % MAX_VEL;
    mouse.vy = ((event.y - mouse.y) / 4) % MAX_VEL;
    mouse.x = event.x;
    mouse.y = event.y;
}, false);
window.addEventListener('mousedown', function(event) {
    mousedown = true;
}, false);
window.addEventListener('mouseup', function(event) {
    mousedown = false;
}, false);
window.addEventListener('mousewheel', function(event) {
    if (DEMO_MOUSE_RANGE) mouse_range += Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail))) * 2;
}, false);
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
    this.drawx = x;
    this.drawy = y;
    this.color = color;
    this.id = id;
    this.bounds = new AABB(x, y, radius, radius);
    this.targeted = false;

    this.setTargeted = function(val) {this.targeted = val};

    this.draw = function() {
        c.beginPath();
        c.arc(this.drawx, this.drawy, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.targeted ? 'red' : COLORS[color];
        c.fill();
    }
    this.tick = function() {
        if (this.x + this.radius > innerWidth) this.vx = -Math.abs(this.vx);
        else if (this.x - this.radius < 0) this.vx = Math.abs(this.vx);
        if (this.y + this.radius > innerHeight) this.vy = -Math.abs(this.vy);
        else if (this.y - this.radius < 0) this.vy = Math.abs(this.vy);
        this.x += this.vx;
        this.y += this.vy;
        if (mousedown && Math.abs(mouse.x - this.x) < mouse_range && Math.abs(mouse.y - this.y) < mouse_range) {
            this.vx = mouse.vx;
            this.vy = mouse.vy;
        }
        if (PAN) {
            this.drawx = this.x - (mouse.x - this.x) * (this.radius * this.radius / RAD_MAX) * PAN_CONSTANT;
            this.drawy = this.y - (mouse.y - this.y) * (this.radius * this.radius / RAD_MAX) * PAN_CONSTANT;
        }
        else {
            this.drawx = this.x;
            this.drawy = this.y;
        }
    }
}

/********************************************
 *  Functions
 ********************************************/
function key(id1, id2) {
    if (id1 < id2) return id1 + "," + id2;
    return id2 + "," + id1;
}
function toggle_mouse_demo() {
    DEMO_MOUSE_RANGE = !DEMO_MOUSE_RANGE;
    if (DEMO_MOUSE_RANGE)
        alert('Mouse Range Demo is now active:\n1. Use the scrollwheel to resize the selection box\n2. Click to drag contents of selection box');
    if (PAN)
        alert('Note: You have Panning enabled, so the range will highlight objects that appear to be outside the boundary, however, '+
            'these objects only appear this way.  The Panning augments their draw-location.');
}
function toggle_tree_demo() {
    if (PAN) {
        alert('You must toggle Panning before enabling the Quad Tree Demonstration');
        return;
    }
    DEMO_QUAD_TREE = !DEMO_QUAD_TREE;
    if (DEMO_QUAD_TREE) {
        alert('Quad Tree Demo is now active:\nGreen Rectangles represent the bounds of a QuadTree Leaf');
    }
}
function toggle_pan() {
    PAN = !PAN;
}
function gen_circle() {
    var radius = random_range(RAD_MIN, RAD_MAX);
    circles.push(new Circle(
        random_range(radius, innerWidth - radius),
        random_range(radius, innerHeight - radius),
        radius,
        (Math.random() - 0.5) * MAX_VEL,
        (Math.random() - 0.5) * MAX_VEL,
        Math.floor((Math.random() * COLORS.length)),
        circles.length
    ));
}

/********************************************
 *  Init and Update
 ********************************************/
function init() {
    const_init();

    qtree = new QuadTree(new AABB(innerWidth / 2, innerHeight / 2, innerWidth / 2, innerHeight / 2), 1);
    circles = [];
}

function update() {
    window.requestAnimationFrame(update);
    c.clearRect(0, 0, innerWidth, innerHeight);

    if (circles.length < NUM_BALLS) gen_circle();

    for (var i = 0; i < circles.length; i++) {
        circles[i].tick();
        qtree.insert(circles[i]);
    }
    if (DEMO_MOUSE_RANGE) {
        var m = [];
        qtree.getObjectsInBounds(new AABB(mouse.x, mouse.y, mouse_range, mouse_range), m);
        for (var i in m) {
            m[i].setTargeted(true);
        }
    }

    for (var i in circles) {
        bounds = new AABB(circles[i].x, circles[i].y, RANGE, RANGE);
        var members = [];
        qtree.getObjectsInBounds(bounds, members);
        for (var j in members) {
            if (circles[i] == members[j]) continue;
            if (dictionary[key(circles[i].id, members[j].id)]) continue;
            dictionary[key(circles[i].id, members[j].id)] = true;

            c.beginPath();
            c.strokeStyle = COLORS[2];
            c.lineWidth = "1";
            c.moveTo(circles[i].drawx, circles[i].drawy);
            c.lineTo(members[j].drawx, members[j].drawy);
            c.stroke();
        }
    }
    for (var i in circles) {
        circles[i].draw();
        circles[i].setTargeted(false);
    }
    if (DEMO_QUAD_TREE)
        drawQuad(qtree);
    if (DEMO_MOUSE_RANGE) {
        c.beginPath();
        c.strokeStyle = 'red';
        c.rect(mouse.x - mouse_range, mouse.y - mouse_range, mouse_range * 2, mouse_range * 2);
        c.stroke();
    }

    dictionary = {};
    qtree.reset();
}
function drawQuad(tree) {
    var bounds = tree.bounds;
    c.beginPath();
    c.lineWidth = "1";
    c.strokeStyle = 'green';
    c.rect(bounds.centerX - bounds.hWidth, bounds.centerY - bounds.hHeight, bounds.hWidth * 2, bounds.hHeight * 2);
    c.stroke();
    if (tree.divided) {
        drawQuad(tree.nw);
        drawQuad(tree.ne);
        drawQuad(tree.sw);
        drawQuad(tree.se);
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