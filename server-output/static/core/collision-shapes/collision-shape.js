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
        return { state: false, mtv: null };
    }
    if (a.get_type() === "polygon" && b.get_type() === "polygon") {
        // only supporting polygon / polygon collisions for now

        const axis = [];
        axis.push(...a.get_axis());
        axis.push(...b.get_axis()); //TODO

        let smallest = null;
        let minOv = Infinity;

        for (const ax of axis) {
            const p1 = a.project(ax);
            const p2 = b.project(ax);


            if (!overlap(p1, p2)) {
                return { state: false, mtv: null };
            }
            else{

                let o = getOverlap(p1,p2);

                if(o < minOv){
                    minOv = o;
                    smallest = ax;
                }
            }
        }
        
        const currMTV = [smallest[0] * minOv, smallest[1] * minOv];
        console.log(`this is the currMTV: ${currMTV}`);
        return {state: true, mtv: currMTV};

    }
    return { state: false, mtv: null };
}

export function overlap(p1, p2) {
    // p_[0]: min, p_[1]: max
    return p1[0] < p2[1] && p1[1] > p2[0];
}


export function getOverlap(p1, p2){

    return Math.min(p1[1], p2[1]) - Math.max(p1[0], p2[0]);

}


