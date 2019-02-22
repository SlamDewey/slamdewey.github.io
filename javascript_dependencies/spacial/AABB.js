/*
    An implementation of an Axis Aligned Bounding Box in JS by jared Massa

    This code is designed as an implementation of previous work I did in
    developing a Spacial Quad Tree in Java.  This is a 2D version of the 
    common Oct-tree, used for 3D collisison detection.  This AABB is the
    basis for the quad tree leaf components, and querying.

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

 class AABB {
    /*
        A constructor for rectangular AABBs

        @param x        the center left x coordinate
        @param y        the center left y coordinate
        @param hWidth   half the width of this rectangular
        @param hHeight  half the height of this rectangular
    */
    constructor(x, y, hWidth, hHeight) {
        this.centerX = x;
        this.centerY = y;
        this.hWidth = hWidth;
        this.hHeight = hHeight;
    }
    /*
        Determins if a given coordinate is contained in this AABB

        @param x the x coordinate
        @param y the y coordinate
    */
    contains(x, y) {
        return (x <= this.centerX + this.hWidth &&
                x >= this.centerX - this.hWidth &&
                y <= this.centerY + this.hHeight &&
                y >= this.centerY - this.hHeight );
    }

    /*
        Determins if this AABB intersects another

        @param other    the other AABB to be checked against
    */
    intersects(other){
        return !(	this.centerX + this.hWidth    <= other.centerX - other.hWidth     ||
                    this.centerX - this.hWidth    >= other.centerX + other.hWidth     ||
                    this.centerY + this.hHeight   <= other.centerY - other.hHeight    ||
                    this.centerY - this.hHeight   >= other.centerY + other.hHeight    );
    }

    /*
        A toString for debugging purposes
    */
   toString() {
       return ("Center: (" + this.centerX + ", " + this.centerY + ")\t|\thWidth: " + this.hWidth + ", hHeight: " + this.hHeight);
   }
}