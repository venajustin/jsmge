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
    async _setup() {

        this._s_index = new Map();

        for (const o of this._objects) {
            await o._setup(this);
        }
    }
    // like setup but with p5 context
    // for loading images to p5
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
    _test_collisions(curr_matrix) {

        let colliders = [];
        for (const obj of this._objects) {
            colliders.push(...obj._get_colliders(curr_matrix)); // TODO: make independant of p5, probably pass matrix rather than p context
        }
        // console.log("Colliders:");
        // console.log(colliders);
        // for (const col of colliders) {
        //     console.log(col.collider._shape.get_axis()) ;
        // }

        // TODO: use octree
        for (const col1 of colliders) {
            for (const col2 of colliders) {
                if (col1 !== col2) {
                    if (collide(col1.collider._shape, col2.collider._shape)) {
                        col1.collider._parent._collision(col2.collider._parent);
                        // console.log("collision");
                    }
                }
            }
        }
    }

    _process_server_updates(update_list) {
        for (const update of update_list) {
            for (const obj of update.objlist) {
                const target = this._s_index.get(obj._id);
                Object.assign(target, obj); // copies all data from obj into target and overwrites same-named members
            }
        }
    }

}


export { Scene } ;

