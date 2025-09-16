// Represents the class-like structures that code and resources are 
// attached to before being instantiated in the scene as objects

export class Frame {



    _pos = { x:0,y:0,z:0 };
    _rot = { x:0,y:0,z:0 };
    _sca = { x:1,y:1,z:1 };
    _parent = undefined;
    _children = [];
    _input_handlers = [];


    _apply_transforms(p) {
        p.translate(this._pos.x,this._pos.y,this._pos.z);
        p.rotate(this._rot.x,this._rot.y,this._rot.z);
        p.scale(this._sca.x,this._sca.y,this._sca.z);
    }

    _draw(p) {
        p.push();
        this._apply_transforms(p);

        this._children.forEach((child) => {
            child._draw(p);
        });
        p.pop();
    }
    _update(inputs) {
        this._children.forEach((o) => {
            o._update(inputs);
        });
    }

    async _load(p) {
        for (const o of this._children) {
            await o._load(p);
        }
    }

    _draw_editor(p) {
        p.push();
        p.translate(this._pos.x,this._pos.y,this._pos.z);

        p.fill(255,0,0,255);
        p.noStroke();
        p.rect(0,0,2,-30);
        p.fill(255,0,0,255);
        p.noStroke();
        p.triangle(1,-35,-3,-30,5,-30);

        p.fill(0,0,255,255);
        p.noStroke();
        p.rect(0,0,30,2);
        p.fill(0,0,255,255);
        p.noStroke();
        p.triangle(35,1,30,-3,30,5);

        p.fill(0,0,0,25);
        p.stroke(0,0,0,100);
        p.rect(1,1,10,-10);



        p.fill(0,0,0,255);
        p.rect(-1,-1,4,4);

        this._children.forEach((child) => {
            child._draw_editor(p);
        });

        p.pop();
    }

    _edit_drag_intersect(p, point, editState) {
        p.push();
        p.translate(this._pos.x,this._pos.y,this._pos.z);

        let output = [];

        // intersect with self
        const globalCoord = p.drawingContext.getTransform().transformPoint(new DOMPoint(0,0,0));

        const a = point.x - globalCoord.x;

        const b =  point.y - globalCoord.y;


       // perform the actual intersection in local space (replace with collision code for each object)

        // intersect with drag square
        if (a > 0 && a < 10 && b < 0 && b > -10) {
            output.push(this);

            // if a parent overlaps its children they should not be translated
            // pop();
            // return output;
        } else if (a > -5 && a < 5 && b < 0 && b > -30) { // intersect with vertical bar
            output.push(this);
            editState.lockX = true;
            // if a parent overlaps its children they should not be translated
            // pop();
            // return output;
        } else if (b > -5 && b < 5 && a > 0 && a < 30) { // intersect with horiz bar
            output.push(this);
            editState.lockY = true;

            // if a parent overlaps its children they should not be translated
            // pop();
            // return output;
        }


       // / interaction with circle
       //  if (Math.pow(a,2) + Math.pow(b,2) < Math.pow(25,2)) {
       //      output.push(this);
       //
       //      // if a parent overlaps its children they should not be translated
       //      pop();
       //      return output;
       //  }


        this._children.forEach((o) => {
            output.push(...o._edit_drag_intersect(p, point, editState));
        });
        p.pop();
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


