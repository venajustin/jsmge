class Collider extends Frame {
    // copy constructor, allows objects to be easily cast to this type
    constructor(obj) {
        super(obj)
    }

    _shape = null;

    // _draw() inherited, there should be nothing rendered for a collision surface

    _draw_editor() {
        super._draw_editor(); // drawing draggable lines, probably should be removed later because this is part of the default frame stuff
        // super manages transforms

        push();
        this._apply_transforms();

        // draw bounding surface here
        if (this._shape != null) {
            this._shape._draw();
        }
        pop();
    }



}