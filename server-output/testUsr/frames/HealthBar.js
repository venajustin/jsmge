
import { Frame } from "#static/core/frame/frame.js";
import {AnimatedSprite} from "#static/core/frame/animated-sprite.js";
import {Collider} from "#static/core/frame/collider.js";
import {CollisionRect} from "#static/core/collision-shapes/collision-rect.js";

export class HealthBar extends Frame {

    setup() {

        this._pos = {x:20,y:0,z:0};

        const scribble_platformer_sprites = new AnimatedSprite();
        scribble_platformer_sprites._add_image_source('./files/resources/button_square_wide.png', 256, 128, 1);
        scribble_platformer_sprites._pos = {x:-128, y:-64,z:0};
        scribble_platformer_sprites.add_animation([0]);
        scribble_platformer_sprites._sca = {x:1,y:1,z:1};
        scribble_platformer_sprites._rot = {x:0,y:0,z:0};
        this._animated_sprites.push(scribble_platformer_sprites);

        const p1Collider = new Collider();
        p1Collider._shape = new CollisionRect();
        p1Collider._shape.width = 256;
        p1Collider._shape.height = 128;
        this._colliders.push(p1Collider);

        this._sca.y = .05;
        this._sca.x = .10;
        this._pos.y = -50;
        this._pos.x = -5;

    }
    start() {
        this._animated_sprites[0].play_animation(0);
    }

    set_w(float_sca) {
        this._sca.x = float_sca;
    }


}
