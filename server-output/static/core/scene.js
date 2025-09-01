

class Scene {
    _objects = [];


    constructor(srcObj) {
        srcObj && Object.assign(this,srcObj);
    }

    _draw() {
        clear()
        this._objects.forEach((o) => {
            o._draw();
        });
    }
    _draw_editor() {
        this._objects.forEach((o) => {
            o._draw_editor();
        });
    }

    _addObject(obj) {
        this._objects.push(obj);
    }

    _edit_drag_intersect(point, editState) {
        let output = [];
        this._objects.forEach((o) => {
           output.push(...o._edit_drag_intersect(point, editState));
        });
        return output;
    }

    _load() {
        this._objects.forEach((o) => {
           o._load();
        });
    }

    _update(inputs) {
        this._objects.forEach((o) => {
            o._update(inputs);
        });
    }

}

