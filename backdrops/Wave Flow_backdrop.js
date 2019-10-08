/*
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

/********************************************
 *  Wave Flow
 ********************************************/
/********************************************
 *  Constants
 ********************************************/

/********************************************
 *  Variables
 ********************************************/
var simplex;
var imgdata, data;
var width;
var height;
var t = 0;
var xOffset = 0, yOffset = 0;
var divisor = 1;
var scale = 20;
/********************************************
 *  Window Listeners
 ********************************************/
window.addEventListener('mousewheel', function(event) {
    divisor += Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail))) * 2
    if (divisor < 1) divisor = 1;
}, false);

/********************************************
 *  Functions
 ********************************************/
var rgbToHex = function (rgb) { 
    var hex = Number(rgb).toString(16);
    if (hex.length < 2)
        hex = "0" + hex;
    return hex;
};
/********************************************
 *  Init and Update
 ********************************************/
function init() {
    const_init();
    width = canvas.width / scale;
    height = canvas.height / scale;
    imgdata = c.getImageData(0, 0, width, height);
    data = imgdata.data;
    simplex = new SimplexNoise();
}

function update() {
    window.requestAnimationFrame(update);
    var radii = [5, 10, 15];
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var color = ['#'];
            for (var i = 0; i < radii.length; i++) {
                var xLoc = Math.sin(t) * radii[i] + (x + xOffset) / divisor;
                var yLoc = Math.cos(t) * radii[i] + (y + yOffset) / divisor;
                var co = Math.round(simplex.noise2D(xLoc, yLoc) * 255);
                if (co < 40) co = 0;
                color += rgbToHex(co);
            }
            c.fillStyle = color;
            c.fillRect(x * scale, y * scale, scale, scale);
        }
    }
    t += 0.0003;
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