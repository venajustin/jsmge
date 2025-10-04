
import { Frame } from "#static/core/frame/frame.js";

export class AnimatedSprite extends Frame {

    // copy constructor, allows objects to be easily cast to this type
    constructor(obj) {
        super(obj)
    }

    _image_sources = [];
    _frames = [];
    _index = 0;
    _animations = [];
    _playing = false;
    _selected_animation = 0;
    _speed = .15;


    _draw(p) {

        p.push();
        p.translate(this._pos.x,this._pos.y,this._pos.z);
        p.rotate(this._rot.x,this._rot.y,this._rot.z);
        p.scale(this._sca.x,this._sca.y,this._sca.z);
        const index = Math.floor(this._index);

        if (this._frames[index]) {
            p.noSmooth();
            p.image(this._frames[index], 0, 0);
        }


        this._children.forEach((child) => {
            child._draw(p);
        });
        p.pop();
    }

    async _load(p) {

        // TODO: make this mess parallel cause everything is sync rn
        for (const imgSource of this._image_sources) {
            p.loadImage(imgSource.img,
                (img) => {
                // success
                   this._add_images(img, imgSource.w, imgSource.h, imgSource.count);

                },
                (e) => {
                // fail
                console.log("failed to load img: " + imgSource.img);
            });

        }

       // const img = await p.loadImage('/static/horse.png');

        //this._add_images(img,192, 144, 7 );



        for (const o of this._children) {
            await o._load(p);
        }

        this.play_animation(0);
    }
    _update(inputs) {
        this._animate();
        super._update(inputs);
    }

    _animate() {
        if (this._playing) {
            this._index += this._speed;

            // float modulus so index is always less than selected animation length
            while (this._index > this._animations[this._selected_animation].length) {
                this._index = this._index - this._animations[this._selected_animation].length;
            }
        }
    }

    _add_image_source(img, w, h, count) {
        this._image_sources.push({img: img, w: w, h: h, count: count});
    }

    // divides image into *count* number of frames
    // if 1 is specified it just grabbs a single frame at 0,0 with w,h for examples
    // if a count is specified larger than the width of the image it will overflow into a grid shape
    _add_images(img, w, h, count) {
        const framesw = Math.floor(img.width / w);
        const framesh = Math.floor(img.height / h);
        for (let i = 0; i < count; i++) {
            let x = (i % framesw) * w;
            let y = (Math.floor(i / framesw)) * h;
            this._frames.push(img.get(x, y, w, h));
        }
    }


    play_animation(anim_index = this._selected_animation) {
        if (this._selected_animation === anim_index) {
            this._playing = true;
            return;
        }
        this._selected_animation = anim_index;
        this._index = 0;
        this._playing = true;
    }
    set_frame(index) {
        this._index = index
    }
    pause_animation() {
        this._playing = false;
    }
    add_animation(animation) {
        this._animations.push(animation);
    }
    remove_animation(index) {
        this._animations.splice(index, 1);
    }



}
