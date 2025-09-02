class CollisionSphere {
    // For now all shapes should have no position, and are always center aligned.
    // The user can realign the collider to move the shape
    radius = 15;

    testPointCollision(point) {
        const sqrr = radius * radius;
        const xx = point.x * point.x;
        const yy = point.y * point.y;

        if (xx + yy < sqrr) {
            return true;
        } else {
            return false;
        }
    }

    _draw() {
        ellipse(0,0,this.radius * 2, this.radius * 2);
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