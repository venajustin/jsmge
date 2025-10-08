import {collide} from "#static/core/collision-shapes/collision-shape.js";


class Scene {
    _objects = [];


    constructor(srcObj) {
        srcObj && Object.assign(this,srcObj);
    }

    _draw(p) {
        p.clear()
        this._objects.forEach((o) => {
            o._draw(p);
        });
    }  
    _draw_editor(p) {
        this._objects.forEach((o) => {
            o._draw_editor(p);
        });
    }

    _addObject(obj) {
        this._objects.push(obj);
    }

    _edit_drag_intersect(p, point, editState) {
        let output = [];
        this._objects.forEach((o) => {
           output.push(...o._edit_drag_intersect(p, point, editState));
        });
        return output;
    }

    async _load(p) {
        for (const o of this._objects) {
           await o._load(p);
        }
    }

    _update(dtime, inputs) {
        this._objects.forEach((o) => {
            o._update(dtime, inputs);
        });
    }
    _test_collisions() {
        let colliders = [];
        for (const obj of this._objects) {
            colliders.push(...obj._get_colliders());
        }
        // console.log("Colliders:");
        // console.log(colliders);
        // for (const col of colliders) {
        //     console.log(col.collider._shape.get_axis()) ;
        // }

        for (const col1 of colliders) {
            for (const col2 of colliders) {
                if (col1 !== col2) {
                    if (collide(col1.collider._shape, col2.collider._shape)) {
                        console.log("collision");
                    }
                }
            }
        }
    }

}


export { Scene } ;

