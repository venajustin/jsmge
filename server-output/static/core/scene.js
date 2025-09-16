

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

    _update(inputs) {
        this._objects.forEach((o) => {
            o._update(inputs);
        });
    }

}


export { Scene } ;

