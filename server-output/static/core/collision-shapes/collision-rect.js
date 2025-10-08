
import {CollisionShape} from "#static/core/collision-shapes/collision-shape.js";

export class CollisionRect extends CollisionShape {

   get_type() {
       return "polygon";
   }

    get_axis() {
        let arr = [];
        let position = this._position_cache;

        // TODO: get these the right way so they rotate (good luck, because also how are you going to get these on server side)
       // TODO: perform transforms on server side without using p5 matrix stack
        arr.push([0,  1]);
        arr.push([ 0,  - 1]);
        arr.push([  1, 0]);
        arr.push([  - 1, 0]);

       // arr.push([position.x, position.y + 1]);
       // arr.push([ position.x, position.y - 1]);
       // arr.push([ position.x + 1, position.y]);
       // arr.push([ position.x - 1, position.y]);

       return arr;
    }

    project(axis) {
       const verticies = [];
       const pos = this._position_cache;
       verticies.push([ pos.x + this.width / 2, pos.y + this.height / 2]);
       verticies.push([ pos.x + this.width / 2, pos.y - this.height / 2]);
       verticies.push([ pos.x - this.width / 2, pos.y + this.height / 2]);
       verticies.push([ pos.x - this.width / 2, pos.y - this.height / 2]);

        let min = math.dot(axis, verticies[0]);
        let max = min;
        for (let i = 1; i < verticies.length; i++) {
            const p = math.dot(axis, verticies[i]);
            if (p < min) {
                min = p;
            } else if (p > max) {
                max = p;
            }
        }
        // projection onto axis vector
        const proj = [min, max];
        return proj;
    }

    _position_cache = null;

    // For now all shapes should have no position, and are always center aligned.
    // The user can realign the collider to move the shape
    width = 30;
    height = 30;

    testPointCollision(point) {
        const hw = this.width / 2;
        const hh = this.height / 2;
        const x = Math.abs(point.x);
        const y = Math.abs(point.y);
        if (x < hw && y < hh) {
            return true;
        } else {
            return false;
        }
    }

    _draw(p) {
        this._position_cache = p.drawingContext.getTransform().transformPoint(new DOMPoint(0,0,0));
        p.fill(0,0,0,0);
        p.stroke(255,255,255,255);
        p.rect(-1 * this.width / 2,-1 * this.height / 2,this.width, this.height);
    }

    // testShapeIntersection(shape) {
    //     // For now I am hardcoding collision with other squares and spheres, we can come up with a general solution later
    //     switch (shape.constructor.name) {
    //         case "CollisionSphere":
    //
    //             break;
    //         case "CollisionSquare":
    //             break;
    //         default:
    //             // If we don't have the shape coded we can just not collide
    //             return false;
    //             break;
    //
    //     }
    // }
}
