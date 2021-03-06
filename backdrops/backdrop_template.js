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
 *  Backdrop file template
 ********************************************/


/********************************************
 *  Init and Update
 ********************************************/
function init() {
    const_init();

    //other init things
}

function update() {
    window.requestAnimationFrame(update);
    c.clearRect(0, 0, innerWidth, innerHeight);

    //update
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