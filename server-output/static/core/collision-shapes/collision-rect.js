class CollisionRect {

    // copy constructor, allows objects to be easily cast to this type
    constructor(obj) {
        obj && Object.assign(this, obj);
    }

    // For now all shapes should have no position, and are always center aligned.
    // The user can realign the collider to move the shape
    width = 30;
    height = 30;

    testPointCollision(point) {
        const hw = width / 2;
        const hh = height / 2;
        const x = Math.abs(point.x);
        const y = Math.abs(point.y);
        if (x < hw && y < hh) {
            return true;
        } else {
            return false;
        }
    }

    _draw() {
        fill(0,0,0,0);
        stroke(0,0,50,100);
        rect(-1 * this.width / 2,-1 * this.height / 2,this.width, this.height);
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