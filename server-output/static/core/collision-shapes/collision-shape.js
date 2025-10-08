///
///
/// Polygon collision algorithm derived from:
/// https://dyn4j.org/2010/01/sat/
///

export class CollisionShape {

    // override in subclases
    _draw(p) {

    }

    get_type() {
        return "none";
    }

}

export function collide(a, b) {
    if (a.get_type() === "none" || b.get_type() === "none") {
        return false;
    }
    if (a.get_type() === "polygon" && b.get_type() === "polygon") {
        // only supporting polygon / polygon collisions for now

        const axis = [];
        axis.push(...a.get_axis());
        axis.push(...b.get_axis()); //TODO

        for (const ax of axis) {
            const p1 = a.project(ax);
            const p2 = b.project(ax);


            if (!overlap(p1, p2)) {
                return false;
            }
        }
        return true;

    }
    return false;
}

export function overlap(p1, p2) {
    // p_[0]: min, p_[1]: max
    return p1[0] < p2[1] && p1[1] > p2[0];
}

