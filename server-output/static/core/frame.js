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
        noStroke();
        rect(0,0,2,-30);
        fill(255,0,0,255);
        noStroke();
        triangle(1,-35,-3,-30,5,-30);

        fill(0,0,255,255);
        noStroke();
        rect(0,0,30,2);
        fill(0,0,255,255);
        noStroke();
        triangle(35,1,30,-3,30,5);


        fill(0,0,0,255);
        rect(-1,-1,4,4);

        this.childrenObj.forEach((child) => {
            child._draw_editor();
        });

        pop();
    }

    _intersect_point(p) {
        push();
        translate(this.position.x,this.position.y,this.position.z);


        console.log()

        let output = [];

        // intersect with self
        const globalCoord = drawingContext.getTransform().transformPoint(new DOMPoint(0,0,0));

        const a = p.x - globalCoord.x;

        const b =  p.y - globalCoord.y;


        // perform the actual intersection in local space (replace with collision code for each object)
        if (Math.pow(a,2) + Math.pow(b,2) < Math.pow(25,2)) {
            output.push(this);

            // if a parent overlaps its children they should not be translated
            pop();
            return output;
        }


        this.childrenObj.forEach((o) => {
            output.push(...o._intersect_point(p));
        });
        pop();
        return output;


    }

    // copy constructor, allows objects to be easily cast to this type
    constructor(obj) {
        obj && Object.assign(this, obj);
    }
    
    // Theoreically frames will spend much of their life as json 
    // objects. They can be saved and loaded through stringify and parse
    toString() {
        return JSON.stringify(this);
    }
}


