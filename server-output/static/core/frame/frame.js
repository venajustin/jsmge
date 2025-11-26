// Represents the class-like structures that code and resources are 
// attached to before being instantiated in the scene as objects
import * as math from "mathjs";
import { create_reference } from '#static/utility/references.js';

// function sync(fn) {
//     return (...params) => {
//
//         fn(...params);
//         server.call(fn.toString());
//     }
// }

export class Frame {

//     takedamage = sync((damage) => {
//
//     });

    static excluded_members = [
        "_parent",
        "_children",
        "_animated_sprites",
        "_colliders"
    ]

    _id;

    _pos = { x:0,y:0,z:0 };
    _rot = { x:0,y:0,z:0 };
    _sca = { x:1,y:1,z:1 };
    _parent = undefined;
    _children = [];

    _animated_sprites = [];
    _colliders = [];

    _owner = undefined;

    _pending_functions = [];

    hidden = false;
    show() {
        this.hidden = false;
    }
    hide() {
        this.hidden = true;
    }

    _apply_transforms(p) {
        p.translate(this._pos.x,this._pos.y,this._pos.z);
        p.rotate(this._rot.x,this._rot.y,this._rot.z);
        p.scale(this._sca.x,this._sca.y,this._sca.z);
    }
    _get_m_translate() {
        return math.matrix([
            [1, 0, this._pos.x],
            [0, 1, this._pos.y],
            [0, 0, 1]
        ]);
    }
    _get_m_rotate() {
        let m =  math.identity(3,3);
        m = math.multiply(m, math.matrix([
            [1, 0, 0],
            [0, math.cos(this._rot.x), -math.sin(this._rot.x)],
            [0, math.sin(this._rot.x), math.cos(this._rot.x)]
        ]));
        m = math.multiply(m, math.matrix([
            [math.cos(this._rot.y), 0, math.sin(this._rot.y)],
            [0, 1, 0],
            [-math.sin(this._rot.y), 0, math.cos(this._rot.y)]
        ]));
        m = math.multiply(m, math.matrix([
            [math.cos(this._rot.z), -math.sin(this._rot.z), 0],
            [math.sin(this._rot.z), math.cos(this._rot.z), 0],
            [0, 0, 1]
        ]));
        return m;
    }
    _get_m_scale() {
        return math.matrix([
            [this._sca.x, 0, 0],
            [0, this._sca.y, 0],
            [0, 0, 1]
        ]);

    }
    _get_matrix() {
        let mat = math.identity(3,3);
        mat = math.multiply(mat, this._get_m_translate());
        mat = math.multiply(mat, this._get_m_rotate());
        mat = math.multiply(mat, this._get_m_scale());

        return mat;

    }

    _draw(p) {


        p.push();
        this._apply_transforms(p);

        if (!this.hidden){
            this._animated_sprites.forEach((child) => {
                child._draw(p);
            });

            this._children.forEach((child) => {
                child._draw(p);
            });
        }
        p.pop();
    }


    // user override
    handle_input(inputs) {

    }
    // user override
    handle_collision(other) {

    }
    // user override
    process_physics(deltaTime) {

    }
    _update(dtime, inputs) {
        // this.handle_input(inputs); only called in PlayerFrame
        this.process_physics(dtime);


        this._children.forEach((o) => {
            o._update(dtime, inputs);
        });
         this._animated_sprites.forEach((o) => {
             o._update(dtime, inputs);
         });
    }
    _update_from_clients(clientmap) {

        this._children.forEach((o) => {
            o._update_from_clients(clientmap);
        });
    }
    _collision(other) {
        this.handle_collision(create_reference(other));

    }

    start() {

    }
    setup() {
        // user code to be called on server side when adding to scene
    }

    get_parent() {
        return create_reference(this._parent);
    }
    get_child(name) {
        for (const o of this._children) {
            if (o.constructor.name === name) {
                return create_reference(o);
            }
        }
    }

    async _setup(scene) {
        scene._s_index.set(this._id, this);
        this.start(); // user code to be called on all nodes at start of game
        for (const o of this._animated_sprites) {
            await o._setup(scene);
            o._parent = this;
        }
        for (const o of this._colliders) {
            await o._setup(scene);
            o._parent = this;
        }
        for (const o of this._children) {
            await o._setup(scene);
            o._parent = this;
        }
    }
    // like setup but with p5 context
    // for loading images to p5
    async _load(p) {
        for (const o of this._animated_sprites) {
            await o._load(p);
        }
        for (const o of this._colliders) {
            await o._load(p);
        }
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

        this._colliders.forEach((child) => {
            child._draw(p);
        });
        this._children.forEach((child) => {
            child._draw_editor(p);
        });

        p.pop();
    }

    _edit_drag_intersect(point, editState) {
        const mat = this._get_matrix();
        const inv = math.inv(mat);
        editState.mat = math.multiply(editState.mat, mat) 

        let output = [];

        // intersect in global space
        const globalCoord = [editState.mat._data[0][2],editState.mat._data[1][2]];
        // const globalCoord = p.drawingContext.getTransform().transformPoint(new DOMPoint(0,0));

        const a = point.x - globalCoord[0];

        const b =  point.y - globalCoord[1];


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
            output.push(...o._edit_drag_intersect(point, editState));
        });
        editState.mat = math.multiply(editState.mat, inv) 
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

    _get_colliders(context) {
        const matcache = context.mat;
        context.mat = math.multiply(context.mat, this._get_matrix());

        const arr = [];

        for (const coll of this._colliders) {
            coll._set_cache(context);
            arr.push({ collider: coll })
        }

        for (const obj of this._children) {
            arr.push(...obj._get_colliders(context));
        }

        context.mat = matcache;
        // context.mat = math.multiply(context.mat, math.inv(this._get_matrix()));

        return arr;

    }

    _get_sync_members() {
        let output = {};
        let list = [];
        for (const property in this) {
            if (Frame.excluded_members.indexOf(property) === -1) {
                output[property] = this[property];
            }
        }
        list.push(output);
        for (const child of this._children) {
            list.push(...child._get_sync_members());
        }
        return list;
           
    }

    _get_owned_members(playerid) {
        let list = [];
        for (const  child in this._children) {
            list.push(...child._get_owned_members(playerid));
        }
        return list;

    }
}



