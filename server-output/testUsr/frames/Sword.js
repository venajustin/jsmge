
import { Frame } from "#static/core/frame/frame.js";
import {AnimatedSprite} from "#static/core/frame/animated-sprite.js";
import {Collider} from "#static/core/frame/collider.js";
import {CollisionRect} from "#static/core/collision-shapes/collision-rect.js";

export class Sword extends Frame {

    setup() {

        this._pos = {x:20,y:0,z:0};

        const scribble_platformer_sprites = new AnimatedSprite();
        scribble_platformer_sprites._add_image_source('./files/resources/scribble_platformer.png', 64, 64, 121);
        scribble_platformer_sprites._pos = {x:-32, y:-48,z:0};
        scribble_platformer_sprites.add_animation([7]);
        scribble_platformer_sprites._sca = {x:1,y:1,z:1};
        scribble_platformer_sprites._rot = {x:0,y:0,z:0};
        this._animated_sprites.push(scribble_platformer_sprites);

        const p1Collider = new Collider();
        p1Collider._shape = new CollisionRect();
        p1Collider._shape.width = 16;
        p1Collider._shape.height = 64;
        this._colliders.push(p1Collider);
    }
    start() {
        this._animated_sprites[0].play_animation(0);
    }

    swinging = 0;
    swing() {
        this.swinging = 0.1;
    }

    process_physics(deltaTime) {
        if (this.swinging > 0) {
            this.swinging += 0.001 * deltaTime;
        }
        if (this.swinging > 2 * 3.1415) {
            this.swinging = 0;
        }
        this._rot.x = this.swinging + (3.1415 / 4);
    }

}
