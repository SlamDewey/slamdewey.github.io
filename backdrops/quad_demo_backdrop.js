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
        "<div class=\"option-selection-button\" onclick=\"toggle_mouse_demo()\">Toggle Mouse Bounds Demo" +
            "<span class=\"tooltiptext\">Adds bounds around the mouse and queries the tree for its contents.  Highlights in red.</span>" +
        "</div>" +
        "<div class=\"option-selection-button\" onclick=\"toggle_tree_demo()\">Toggle QuadTree Graphic" +
            "<span class=\"tooltiptext\">Shows the leaf breakdown of the quad tree</span>" +
        "</div>" +
        "<div class=\"option-selection-button\" onclick=\"toggle_pan()\">Toggle \'Panning\'" +
            "<span class=\"tooltiptext\">\'Panning\' uses the mouse position and ball radius to augment draw location</span>" +
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
/*
    The panning works by augmenting draw location more for objects further from the mouse location.
    For standard aspect ratios it can become clear that objects far away in the X axis have stretched
    connections in those closer to being horizontal.
    This way we can reset one of these constants based on the aspect ratio and treat it as a variable.
*/
var PAN_CONSTANT_X;
const PAN_CONSTANT_Y = 0.025;
const NUM_BALLS = 350;
const RAD_MAX = 5;
const RAD_MIN = 3;
const RANGE = 80;
const MAX_MOUSE_VEL = 3;
const MAX_SPAWN_VEL = 1;
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
    x: innerWidth / 2,
    y: innerHeight / 2,
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
    mouse.vx = ((event.x - mouse.x) / 4) % MAX_MOUSE_VEL;
    mouse.vy = ((event.y - mouse.y) / 4) % MAX_MOUSE_VEL;
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
        //if we're within the mouse range, let the mouse drag us up
        if (mousedown && Math.abs(mouse.x - this.x) < mouse_range && Math.abs(mouse.y - this.y) < mouse_range) {
            this.vx = mouse.vx;
            this.vy = mouse.vy;
        }
        //adjust for pan option
        if (PAN) {
            this.drawx = this.x - (mouse.x - this.x) * (this.radius * this.radius / RAD_MAX) * PAN_CONSTANT_X;
            this.drawy = this.y - (mouse.y - this.y) * (this.radius * this.radius / RAD_MAX) * PAN_CONSTANT_Y;
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
/*
    generate a key based on two numbers where the smaller number is always first
    this is used for ensuring we don't check the same two orbs more than once
*/
function key(id1, id2) {
    if (id1 < id2) return id1 + "," + id2;
    return id2 + "," + id1;
}
function gen_circle() {
    var radius = random_range(RAD_MIN, RAD_MAX);
    circles.push(new Circle(
        random_range(radius, innerWidth - radius),      // Center X position
        random_range(radius, innerHeight - radius),     // Center Y position
        radius,                                         // radius
        Math.random() * MAX_SPAWN_VEL - (MAX_SPAWN_VEL / 2),    // X velocity
        Math.random() * MAX_SPAWN_VEL - (MAX_SPAWN_VEL / 2),    // Y velocity
        Math.floor((Math.random() * COLORS.length)),    // color index
        circles.length                                  // id
    ));
}

function toggle_mouse_demo() {
    DEMO_MOUSE_RANGE = !DEMO_MOUSE_RANGE;
    if (DEMO_MOUSE_RANGE)
        alert('Mouse Range graphic is now active:\n1. Use the scrollwheel to resize the selection box\n2. Click to drag contents of selection box');
    if (PAN)
        alert('Note: You have \'Panning\' enabled, so the range will highlight objects that appear to be outside the boundary, however, '+
            'these objects only appear this way.  The \'Panning\' augments their draw-location.');
}
function toggle_tree_demo() {
    if (PAN) {
        alert('You must toggle \'Panning\' before enabling the QuadTree graphic');
        return;
    }
    DEMO_QUAD_TREE = !DEMO_QUAD_TREE;
    if (DEMO_QUAD_TREE) {
        alert('QuadTree graphic is now active:\nGreen rectangles will be drawn along the bounds of a QuadTree Leaf\nTry Re-Initializing for best illustration of functionality!');
    }
}
function toggle_pan() {
    if (DEMO_QUAD_TREE) {
        alert('You must first disable the QuadTree graphic before enabling \'Panning\'');
        return;
    }
    PAN = !PAN;
}


/********************************************
 *  Init and Update
 ********************************************/
function init() {
    const_init();

    //set horizontal pan constant based on aspect ratio of screen to avoid X-Stretching of connections
    PAN_CONSTANT_X = (innerHeight / innerWidth ) * PAN_CONSTANT_Y;

    //initialize quad tree and ensure empty circle array in case this isn't the first init() call
    qtree = new QuadTree(new AABB(innerWidth / 2, innerHeight / 2, innerWidth / 2, innerHeight / 2), 1);
    circles = [];
}

function update() {
    window.requestAnimationFrame(update);
    c.clearRect(0, 0, innerWidth, innerHeight);

    //this is an 'animation' when initializing the tree to slowly increase the
    //number of balls on the screen.  I think it looks cool.
    if (circles.length < NUM_BALLS) gen_circle();

    //tick every ball and add it to the quad tree for this frame.
    for (var i = 0; i < circles.length; i++) {
        circles[i].tick();
        qtree.insert(circles[i]);
    }

    //Graphics functionality
    //normally I would move this section into split up functions, but
    //they really aren't enough code for me to feel comfortable about
    //the overhead

    //if we are drawing the bounds around the mouse,
    if (DEMO_MOUSE_RANGE) {
        var m = [];
        //get all the objects in the mouse range
        qtree.getObjectsInBounds(new AABB(mouse.x, mouse.y, mouse_range, mouse_range), m);
        //mark them as targeted (so they are drawn in red later)
        for (var i in m) {
            m[i].setTargeted(true);
        }
    }
    //for every ball
    for (var i in circles) {
        //make bounds centered on the ball
        bounds = new AABB(circles[i].x, circles[i].y, RANGE, RANGE);
        var members = [];
        //get the nearby balls inside these bounds
        qtree.getObjectsInBounds(bounds, members);
        //for each of those members
        for (var j in members) {
            //if that member is us, continue (can happen since we only query bounds on the QT)
            if (circles[i] == members[j]) continue;
            //if we already checked this pair of balls, go to the next member
            if (dictionary[key(circles[i].id, members[j].id)]) continue;
            //else add this pair to the list of checked ones
            dictionary[key(circles[i].id, members[j].id)] = true;
            //and draw a line between them
            var dx = (circles[i].x - members[j].x),
                dy = (circles[i].y - members[j].y),
                d;
            d = Math.sqrt(dx * dx + dy * dy);
            //ensure the range is now circular instead of a square (looks cleaner)
            if (d > RANGE) continue;
            c.beginPath();
            c.strokeStyle = COLORS[2];
            c.lineWidth = "1";
            c.moveTo(circles[i].drawx, circles[i].drawy);
            c.lineTo(members[j].drawx, members[j].drawy);
            c.stroke();
        }
    }
    //now draw each ball so that the lines are drawn underneath
    for (var i in circles) {
        circles[i].draw();
        //reset targeted state ... it makes more sense to do it here
        //then in the circle's .draw() function
        circles[i].setTargeted(false);
    }
    //recursively draw quad tree if option is selected
    if (DEMO_QUAD_TREE)
        drawQuad(qtree);
    //draw mouse bounds on top of everything if selected
    if (DEMO_MOUSE_RANGE) {
        c.beginPath();
        c.strokeStyle = 'red';
        c.rect(mouse.x - mouse_range, mouse.y - mouse_range, mouse_range * 2, mouse_range * 2);
        c.stroke();
    }
    //reset key dictionary and quad tree for next frame
    dictionary = {};
    qtree.reset();
}
function drawQuad(tree) {
    var bounds = tree.bounds;
    //draw this quad tree
    c.beginPath();
    c.lineWidth = "1";
    c.strokeStyle = 'green';
    c.rect(bounds.centerX - bounds.hWidth, bounds.centerY - bounds.hHeight, bounds.hWidth * 2, bounds.hHeight * 2);
    c.stroke();
    //if this tree has children, recursively draw its children
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