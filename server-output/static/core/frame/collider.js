import { Frame } from "#static/core/frame/frame.js";

export class Collider extends Frame {
    // copy constructor, allows objects to be easily cast to this type
    constructor(obj) {
        super(obj)
    }

    _shape = null;

    // _draw(p) inherited, there should be nothing rendered for a collision surface

    _draw(p) {
        // super._draw_editor(p); // drawing draggable lines, probably should be removed later because this is part of the default frame stuff
        // super manages transforms

        p.push();
        this._apply_transforms(p);

        // draw bounding surface here
        if (this._shape != null) {
            this._shape._draw(p);
        }
        p.pop();
    }
    _draw_editor(p) {
        super._draw_editor(p); // drawing draggable lines, probably should be removed later because this is part of the default frame stuff
        // super manages transforms

        p.push();
        this._apply_transforms(p);

        // draw bounding surface here
        if (this._shape != null) {
            this._shape._draw(p);
        }
        p.pop();
    }



}
