// Represents the class-like structures that code and resources are 
// attached to before being instantiated in the scene as objects

class Frame {

    position = { x:0,y:0,z:0 };
    rotation = { x:0,y:0,z:0 };
    scale = { x:1,y:1,z:1 };
    parentObj = undefined;
    childrenObj = [];

    _draw() {
        push();
        translate(this.position.x,this.position.y,this.position.z);
        rotate(this.rotation.x,this.rotation.y,this.rotation.z);
        scale(this.scale.x,this.scale.y,this.scale.z);
        fill(0,0,0,0);
        circle(0,0,50);
        // scale, rotate, translate
        this.childrenObj.forEach((child) => {
            child._draw();
        });
        pop();
    }

    _draw_editor() {
        push();
        translate(this.position.x,this.position.y,this.position.z);
        fill(255,0,0,255);
        rect(0,0,2,30);
        fill(0,0,255,255);
        rect(0,0,30,2);
        pop();
    }

    constructor(obj) {
        obj && Object.assign(this, obj);
    }
    
    // Theoreically frames will spend much of their life as json 
    // objects. They can be saved and loaded through stringify and parse
    toString() {
        return JSON.stringify(this);
    }
}


