

class Scene {
    objects = [];

    constructor(srcObj) {
        srcObj && Object.assign(this,srcObj);
    }

    _draw() {
        objects.forEach((o) {
            o._draw();
        }
    }

}

