/*
    An implementation of an Quad-Tree in JS by Jared Massa

    This code is designed as an implementation of previous work I did in
    developing a Spacial Quad Tree in Java.  This is a 2D version of the 
    common Oct-tree, used for 3D collisison detection.  For a reference
    to the original quad tree visit: 
    https://github.com/SlamDewey/2d_game_engine/tree/master/src/game/scene/spacial

    That being said it should be stated this follows a psuedocode design shown at:
    https://en.wikipedia.org/wiki/Quadtree#Pseudo_code
    This demonstration makes due without a Point struct (XY on wikipedia).

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

/*
    Prerequisites for use: 
        Bounds are expected to be AABB bounds, you can either make your own or use the
        associated AABB.js file for ease.

        Objects being inserted into the quadtree are expected to have coordinate members
        (x, y) such that 'objectName.x' and 'objectName.y' are a defined number.
*/

const CAPACITY = 3;

class QuadTree {

    /*
        @param bounds   the AABB bounds of this tree node
    */
    constructor(bounds) {
        this.bounds = bounds;
        this.members = [];
        this.nw = null;
        this.ne = null;
        this.sw = null;
        this.se = null;
        this.divided = false;
    }
    
    /*
        This tree is at capacity, so divide into four children
    */
    subdivide() {
        let bounds = this.bounds;
        var nHWidth = bounds.hWidth / 2,
		    nHHeight = bounds.hHeight/ 2;

        this.nw = new QuadTree(new AABB(bounds.centerX - nHWidth, bounds.centerY + nHHeight, nHWidth, nHHeight));
		this.ne = new QuadTree(new AABB(bounds.centerX + nHWidth, bounds.centerY + nHHeight, nHWidth, nHHeight));
		this.sw = new QuadTree(new AABB(bounds.centerX - nHWidth, bounds.centerY - nHHeight, nHWidth, nHHeight));
		this.se = new QuadTree(new AABB(bounds.centerX + nHWidth, bounds.centerY - nHHeight, nHWidth, nHHeight));
        this.divided = true;
    }

    /*
        Adds the specified object into the tree

        @param obj  the object to be tracked
        @param obj_bounds   the AABB bounds of this object (should be a member of the object)
    */
    insert(obj) {
        if (!this.bounds.contains(obj.x, obj.y))
            return false;
        if (this.members.length < CAPACITY) {
            this.members.push(obj);
            return true;
        }
        if (!this.divided){
            this.subdivide();
        }
        if (this.nw.insert(obj)) return true;
        if (this.ne.insert(obj)) return true;
        if (this.sw.insert(obj)) return true;
        if (this.se.insert(obj)) return true;
        return false;
    }

    /*
        reset this quad tree and delete children
    */
    reset() {
        this.nw = this.ne = this.se = this.se = null;
        this.divided = false;
        this.members = [];
    }
    /*
        get all objects inside of the specified bounds

        @param bounds   bounds to check
        @param mems     an originally empty array to be filled with the local group
    */
    getObjectsInBounds(bounds, mems) {
        if (!this.bounds.intersects(bounds)) return mems;
        for (var i in this.members) {
            if (bounds.contains(this.members[i].x, this.members[i].y))
                mems.push(this.members[i]);
        }
        if (!this.divided) return mems;
        this.nw.getObjectsInBounds(bounds, mems);
        this.ne.getObjectsInBounds(bounds, mems);
        this.sw.getObjectsInBounds(bounds, mems);
        this.se.getObjectsInBounds(bounds, mems);
        return mems;
    }
}