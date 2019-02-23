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


/**************************************************************************************
 *  "Graph Theory" Backdrop Code
 **************************************************************************************/

 
/********************************************
 *  Constants
 ********************************************/
const PAN_CONSTANT = 0.01;
const NUM_BALLS = 150;
const RAD_MIN = 2;
const RAD_MAX = 8;
const RANGE = 125;
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
var qtree;              //quad tree
var circles = [];       //to store the balls
var dictionary = {};    //to store keys when we check ball pairs
var mouse = {           //for mouse input and 'camera' panning
    x: 0,
    y: 0
}
var attach_to = "eachother";


/********************************************
 *  Window Listeners
 ********************************************/
window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
}, false);
window.addEventListener('resize', init, false);
window.addEventListener('onkeypress', function(event) {
    var keynum;
    if(window.event) { // IE
        keynum = e.keyCode;
    } else if(e.which){ // Netscape/Firefox/Opera
        keynum = e.which;
    }
    alert('You pressed: ' + String.fromCharCode(keynum));
}, false);



/********************************************
 *  Objects (but really this is a struct factory)
 ********************************************/
function Circle(x, y, radius, vx, vy, color, id) {
    //position, movement, and drawing variables
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.drawx = x;
    this.drawy = y;
    this.color = color;

    //information variables
    this.radius = radius;
    this.bounds = new AABB(x, y, radius, radius);
    this.id = id;
    

    //this is pretty self explanitory
    this.draw = function() {
        c.beginPath();
        c.arc(this.drawx, this.drawy, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = COLORS[color];
        c.fill();
    }
    //update the position of the object and check if still within bounds.
    this.tick = function() {
        //check if we need to bounce, and do so if appropriate
        if (this.x + this.radius > innerWidth) this.vx = -Math.abs(this.vx);
        else if (this.x - this.radius < 0) this.vx = Math.abs(this.vx);
        if (this.y + this.radius > innerHeight) this.vy = -Math.abs(this.vy);
        else if (this.y - this.radius < 0) this.vy = Math.abs(this.vy);
        //update position
        this.x += this.vx;
        this.y += this.vy;
        if (attach_to == "eachother") {
            //this is a special variable for drawing a relative position of this object.
            //it it used to create a sort of 'pan' effect on the screen.  Change PAN_CONSTANT experimentally
            //or change this    ↓ to be a + if you'd like the 'camera' to pan WITH the mouse instead
            this.drawx = this.x - (mouse.x - this.x) * (this.radius * this.radius / RAD_MAX) * PAN_CONSTANT;
            this.drawy = this.y - (mouse.y - this.y) * (this.radius * this.radius / RAD_MAX) * PAN_CONSTANT;
        }
        else {
            this.drawx = this.x;
            this.drawy = this.y;
        }
    }
    // a toString() for debugging purposes of the circle struct
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

    //this function may be called more than once so:
    if (qtree == null)
        qtree = new QuadTree(new AABB(innerWidth / 2, innerHeight / 2, innerWidth, innerHeight));
    else {
        qtree.reset();
        dictionary = {};
        circles = [];
    }
    //generate objects (balls)
    var radius;
    for (var i = 0; i < NUM_BALLS; i++) {
        radius = random_range(RAD_MIN, RAD_MAX);
        circles.push(
            new Circle(
                random_range(radius, innerWidth - radius),  // centerpoint X
                random_range(radius, innerHeight - radius), // centerpoint Y
                radius,                                     // radius
                (Math.random() - 0.5) * 3,                  // velocity X
                (Math.random() - 0.5) * 3,                  // velocity Y
                random_range(0, COLORS.length - 1),         // color index
                i                                           // id
        ));
    }
}

function update() {
    window.requestAnimationFrame(update);
    c.clearRect(0, 0, innerWidth, innerHeight);

    //update balls
    for (var i = 0; i < circles.length; i++) {
        //tick object
        circles[i].tick();
        //insert in quad tree
        qtree.insert(circles[i]);
    }

    var bounds;
    if (attach_to == "eachother") {
        //query quad tree for ball connections, and draw them (for each ball)
        for (var i in circles) {
            //generate the bounds around this circle we might want to draw lines to
            bounds = new AABB(circles[i].x, circles[i].y, RANGE, RANGE);
            //create emtpy members array
            var members = [];
            //pass members array into quad tree method
            qtree.getObjectsInBounds(bounds, members);
            for (var j in members) {
                //if these two circles are the same, move on
                if (circles[i] == members[j]) continue;
                //if we've already checked this pair of objects, move on
                if (dictionary[key(circles[i].id, members[j].id)]) continue;
                //otherwise add this pair of objects to the list
                dictionary[key(circles[i].id, members[j].id)] = true;
                //and measure the distance between them (var d)
                var dx = (circles[i].x - members[j].x),
                    dy = (circles[i].y - members[j].y),
                    d;
                    d = Math.sqrt(dx * dx + dy * dy);
                //if d is within a circular range, draw a line
                if (d < RANGE) {
                    c.strokeStyle = COLORS[2];
                    c.beginPath();
                    c.moveTo(circles[i].drawx, circles[i].drawy);
                    c.lineTo(members[j].drawx, members[j].drawy);
                    c.stroke();
                }
            }
        }
    }
    else {
        bounds = new AABB(mouse.x, mouse.y, RANGE, RANGE);
        var members = [];
        qtree.getObjectsInBounds(bounds, members);
        for (var j in members) {
            //and measure the distance between them (var d)
            var dx = (mouse.x - members[j].x),
                dy = (mouse.y - members[j].y),
                d;
            d = Math.sqrt(dx * dx + dy * dy);
            //if d is within a circular range, draw a line
            if (d < RANGE * 2) {
                c.strokeStyle = COLORS[2];
                c.beginPath();
                c.moveTo(mouse.x, mouse.y);
                c.lineTo(members[j].drawx, members[j].drawy);
                c.stroke();
            }
        }
    }
    //finally...
    for (var i in circles) {
        //then draw circles overtop of the lines
        circles[i].draw();
    }
    //reset key dictionary and quad tree
    dictionary = {};
    qtree.reset();
}
//ensure correct animation frames on all browsers
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