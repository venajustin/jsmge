

class Scene {
    objects = [];


    constructor(srcObj) {
        srcObj && Object.assign(this,srcObj);
    }

    _draw() {
        clear()
        this.objects.forEach((o) => {
            o._draw();
        });
    }
    _draw_editor() {
        this.objects.forEach((o) => {
            o._draw_editor();
        });
    }

    addObject(obj) {
        this.objects.push(obj);
    }

    _intersect_point(point) {
        let output = [];
        this.objects.forEach((o) => {
           output.push(...o._intersect_point(point));
        });
        return output;
    }

}

