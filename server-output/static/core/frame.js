// Represents the class-like structures that code and resources are 
// attached to before being instantiated in the scene as objects

class Frame {

    position = { x:0,y:0,z:0 };
    rotation = { x:0,y:0,z:0 };
    scale = { x:0,y:0,z:0 };
    parentObj = undefined;
    childrenObj = [];
    
    draw() {
        push();
        translate(this.position.x,this.position.y,this.position.z);
        circle(0,0,100);
        // scale, rotate, translate
        this.childrenObj.forEach((child) => {
            child.draw();
        });
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


